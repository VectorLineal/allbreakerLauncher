const { sanitize } = require("isomorphic-dompurify");
const { Application } = require('../models/Application');
const {errorCheckInvalidFields} = require("../middleware/validator");
const { validationResult } = require('express-validator');

//gets a list of all the applications
const getApplications = async (req, res) => {
    try {
        const applications = await Application.findAll();
        return res.status(200).send(applications);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//gets a single application
const getApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await Application.findByPk(id);
        if(application === null) return res.status(404).send({ message: "Entry not found!" });
        return res.status(200).send(application);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//adds a new application to the DB
const createApplication = async (req, res) => {
    try {
        const name = sanitize(req.body?.name);
        const thumbnail = sanitize(req.body?.thumbnail);
        const description = sanitize(req.body?.description);
    
        if (!name || !thumbnail || !description) {
            console.log("body", req.body);
          return res.status(400).send({ message: 'Bad request name, thumbnail or description' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array(), message: errors.array()[0].msg });
        }
        const save = await Application.create({
          name,
          thumbnail,
          description
        });
        return res.status(201).send({ application: save, message: "Application created successfuly" });
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//updates a single application
const updateApplication = async (req, res) => {
    const { id } = req.params;
    try {
      let name = sanitize(req.body?.name);
      let thumbnail = sanitize(req.body?.thumbnail);
      let description = sanitize(req.body?.description);
      if (!name && !thumbnail && !description) {
        return res.status(400).send({ message: 'Bad request; nothing to update' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorIndex = errorCheckInvalidFields(errors);
        if(errorIndex >= 0) return res.status(422).json({ errors: errors.array(), message: errors.array()[errorIndex].msg });
      }

      const application = await Application.findByPk(id);
      if(application === null) return res.status(404).send({ message: "Entry not found!" });

      if(!thumbnail) thumbnail = application.thumbnail;
      if(!name) name = application.name;
      if(!description) description = application.description;

      application.set({
        name,
        thumbnail,
        description
      }); 
      await application.save();
      return res.status(200).send({application, message: "Application update successful"});
     } catch (error) {
      return res.status(500).send({ error, message: "Internal server error." });
    }
};

//Deletes a single application
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        await Application.destroy({
            where: {
              id
            },
          });
        return res.status(200).send({message: "Application with " + id + " was deleted successfuly!"});
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};
module.exports = {
    getApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication
  };