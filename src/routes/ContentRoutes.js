const express = require("express");
const JWTAuth = require('../middleware/JWTAuth');

const router = express.Router();

// Controllers
const contentController = require("../controllers/ContentController");

router.post("/contents", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.createContent);
});

router.get("/contents", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.getContents);
});

router.get("/contents/:userId/:applicationId", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.getContent);
});

router.get("/contentsByUser/:userId", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.getContentByUser);
});

//update
router.put("/contents/:userId/:applicationId", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.updateContent);
});

//delete
router.delete("/contents/:userId/:applicationId", (req, res) => {
	JWTAuth.validateAuth({ req, res }, contentController.deleteContent);
});

module.exports = router;