const { Content } = require('../models/Content');

//Gets all contents
const getContents = async (req, res) => {
    try {
        const contents = await Content.findAll();
        return res.status(200).send(contents);
      } catch (error) {
        return res.status(500).send({ error, message: "internal server error" });
      }
};

//gets a single content froma user and application Ids
const getContent = async (req, res) => {
    const { userId, applicationId } = req.params;
    try {
        const content = await Content.findOne({ where: { userId, applicationId } });
        if(content === null) return res.status(404).send({ message: "Entry not found!" });
        return res.status(200).send(content);
      } catch (error) {
        return res.status(500).send({ error, message: "internal server error" });
      }
};

//Gets all the contents from a single user
const getContentByUser = async (req, res) => {
  const { userId } = req.params;
  try {
      const contents = await Content.findAll({ where: { userId} });
      if(contents === null) return res.status(404).send({ message: "Entry not found!" });
      return res.status(200).send(contents);
    } catch (error) {
      return res.status(500).send({ error, message: "Internal server error." });
    }
};

//creates a content and adds it to the DB
const createContent = async (req, res) => {
    try {
        const available = req.body?.available;
        const userId = req.body?.userId;
        const applicationId = req.body?.applicationId;
    
        if (!userId || !applicationId) {
          //console.log("body", req.body);
          return res.status(400).send({ message: 'Bad request userId or applicationId' });
        }
        const save = await Content.create({
          available,
          userId,
          applicationId
        });
        return res.status(201).send({ content: save, message: "Content created successfuly" });
      } catch (error) {
        return res.status(500).send({ error, message: error.original.detail });
      }
};

//updates a single content from a user and application Ids
const updateContent = async (req, res) => {
    const { userId, applicationId } = req.params;
    try {
        const available = req.body?.available;

        const content = await Content.findOne({ where: { userId, applicationId } });
        if(content === null) return res.status(404).send({ message: "Entry not found!" });
        content.set({
          available
        }); 
        await content.save();
        return res.status(200).send(content);
      } catch (error) {
        return res.status(500).send({ error, message: "internal server error" });
      }
};

//deletes a single content from a user and application Ids
const deleteContent = async (req, res) => {
  const { userId, applicationId } = req.params;
    try {
        await Content.destroy({
            where: {
              userId, 
              applicationId 
            },
          });
        return res.status(200).send({message: "Content with (" + userId + ", " + applicationId + ") FKs was deleted successfuly!"});
      } catch (error) {
        return res.status(500).send({ error, message: "internal server error" });
      }
};
module.exports = {
    getContents,
    getContent,
    getContentByUser,
    createContent,
    updateContent,
    deleteContent
  };
