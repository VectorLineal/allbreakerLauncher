const express = require("express");
const JWTAuth = require('../middleware/JWTAuth');
const { check } = require('express-validator');

const router = express.Router();

let loginValidate = [
	check('description').trim(),
	check('thumbnail', 'This must Be an URL of an image').isURL(),
	check('name').trim()
];

// Controllers
const applicationController = require("../controllers/ApplicationController");

router.post("/applications", loginValidate, (req, res) => {
	JWTAuth.validateAuth({ req, res }, applicationController.createApplication);
});

router.get("/applications", (req, res) => {
	JWTAuth.validateAuth({ req, res }, applicationController.getApplications);
});

router.get("/applications/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, applicationController.getApplication);
});

//update
router.put("/applications/:id", loginValidate, (req, res) => {
	JWTAuth.validateAuth({ req, res }, applicationController.updateApplication);
});

//delete
router.delete("/applications/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, applicationController.deleteApplication);
});

module.exports = router;