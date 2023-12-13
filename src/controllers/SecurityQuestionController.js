const { sanitize } = require("isomorphic-dompurify");
const { SecurityQuestion } = require('../models/SecurityQuestion');

//gets all security questions
const getSecurityQuestions = async (req, res) => {
    try {
        const securityQuestions = await SecurityQuestion.findAll();
        return res.status(200).send(securityQuestions);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//gets all security questions for a user
const getSecurityQuestionsFromUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const securityQuestions = await SecurityQuestion.findAll({ where: { userId } });
        if(securityQuestions === null) return res.status(404).send({ message: "Entry not found!" });
        return res.status(200).send(securityQuestions);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//adds a security question to the DB
const createSecurityQuestion = async (req, res) => {
    try {
        const question = req.body?.question;
        const userId = req.body?.userId;
        const answer = sanitize(req.body?.answer);
    
        if (!userId || !question || !answer) {
          console.log("body", req.body);
          return res.status(400).send({ message: 'Bad request question, answer or user.' });
        }
        const save = await SecurityQuestion.create({
          question,
          userId,
          answer
        });
        return res.status(201).send({ securityQuestion: save, message: "Question added successfuly." });
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//updates a single security question
const updateSecurityQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const answer = sanitize(req.body?.answer);

        const securityQuestion = await SecurityQuestion.findByPk(id);
        if(securityQuestion === null) return res.status(404).send({ message: "Entry not found!" });
        securityQuestion.set({
            answer
        }); 
        await securityQuestion.save();
        return res.status(200).send(securityQuestion);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//deletes a single security question
const deleteSecurityQuestion = async (req, res) => {
  const { id } = req.params;
    try {
        await SecurityQuestion.destroy({
            where: {
              id
            },
          });
        return res.status(200).send({message: "Security Question with (" + id + ") PK was deleted successfuly!"});
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};
module.exports = {
    getSecurityQuestions,
    getSecurityQuestionsFromUser,
    createSecurityQuestion,
    updateSecurityQuestion,
    deleteSecurityQuestion
  };