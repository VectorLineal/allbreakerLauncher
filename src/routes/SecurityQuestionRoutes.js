const express = require("express");
const JWTAuth = require('../middleware/JWTAuth');

const router = express.Router();

// Controllers
const securityQuestionController = require("../controllers/SecurityQuestionController");

router.post("/questions", (req, res) => {
	JWTAuth.validateAuth({ req, res }, securityQuestionController.createSecurityQuestion);
});

router.get("/questions", (req, res) => {
	JWTAuth.validateAuth({ req, res }, securityQuestionController.getSecurityQuestions);
});

router.get("/questions/:userId", (req, res) => {
	JWTAuth.validateAuth({ req, res }, securityQuestionController.getSecurityQuestionsFromUser);
});

//update
router.put("/questions/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, securityQuestionController.updateSecurityQuestion);
});

//delete
router.delete("/questions/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, securityQuestionController.deleteSecurityQuestion);
});

module.exports = router;