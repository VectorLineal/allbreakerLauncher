const express = require("express");
const JWTAuth = require('../middleware/JWTAuth');
const { check } = require('express-validator');

const router = express.Router();
let loginValidate = [
	// Check Username
	check('email', 'Must Be a valid Email Address').isEmail().trim().escape(),
	check('password').isLength({ min: 8 }).withMessage('Password Must Be at Least 8 Characters').matches('[0-9]').withMessage('Password Must Contain a Number').matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter').escape(),
	check('name').trim()
];
// Controllers
const userController = require("../controllers/UserController");

//crea un usuario
router.post("/users", loginValidate, (req, res) => {
	 userController.createUser(req, res);
});

//autenticacion
router.post("/login", (req, res) => {
	userController.login(req, res);
});

router.get("/users", (req, res) => {
	JWTAuth.validateAuth({ req, res }, userController.getUsers);
});

//a single user
router.get("/users/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, userController.getUser);
});

//update
//a single user
router.put("/users/:id", loginValidate, (req, res) => {
	JWTAuth.validateAuth({ req, res }, userController.updateUser);
});

//delete
//a single user
router.delete("/users/:id", (req, res) => {
	JWTAuth.validateAuth({ req, res }, userController.deleteUser);
});

module.exports = router;