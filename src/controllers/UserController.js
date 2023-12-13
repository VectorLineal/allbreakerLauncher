const jwt = require("jsonwebtoken");
const { sanitize } = require("isomorphic-dompurify");
const { User } = require('../models/User');
const {hashPassword, comparePassword, errorCheckInvalidFields} = require("../middleware/validator");
const { validationResult } = require('express-validator');

//gets a list with all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).send(users);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//gets a single user
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if(user === null) return res.status(404).send({ message: "Entry not found!" });
        return res.status(200).send(user);
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//adds a new user to the DB
const createUser = async (req, res) => {
    try {
        const name = sanitize(req.body?.name);
        const password = sanitize(req.body?.password);
        const email = sanitize(req.body?.email);
    
        if (!name || !password || !email) {
          //console.log("body", req.body);
          return res.status(400).send({ message: 'Bad request; name, age or email are missing' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array(), message: errors.array()[0].msg});
        }
        try{
          const hashedPassword = await hashPassword(password);
          console.log("hashed Password:", hashedPassword);
          const save = await User.create({
            name,
            password: hashedPassword,
            email
          });
          return res.status(201).send({ user: save, message: "Account creation successful" });
        }catch(error){
            return res.status(422).send({ error, message: "This Email is already registered." });
        }
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};

//Tries to authenticate in the system with an email and a password and returns a cookie with the authentication token
const login = async (req, res) => {
  try {
    const password = sanitize(req.body?.password);
    const email = sanitize(req.body?.email);
  
      if (!password || !email) {
          console.log("body", req.body);
        return res.status(400).send({ message: 'Bad request; password or email are missing' });
      }
      try{
        const user = await User.findOne({ where: { email } });
        if(user === null) return res.status(403).send({ message: "Email not registered" });
        const isPasswordValid = await comparePassword(password, user.password);
        
        if(isPasswordValid){
          const token = jwt.sign({ email, password}, process.env.MY_SECRET, { expiresIn: "600s" });
          console.log("new token:", token);
          if(token != "" && token != null){
            res.cookie("token", token, {
              httpOnly: true /*,
              secure: true,
              signed: true,
              maxAge: 100000*/,
            });
            return res.status(201).send({ token, user: user.id, message: "login successful"});
          }
        }
        return res.status(403).send({ message: "invalid authentication" });
      }catch(error){
          return res.status(500).send({ error, message: "Inetrnal server error." });
      }
    } catch (error) {
      return res.status(500).send({ error, message: "Inetrnal server error." });
    }
};

//updates a single user
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      let name = sanitize(req.body?.name);
      let password = sanitize(req.body?.password);
      let email = sanitize(req.body?.email);
      if (!name && !password && !email) {
        return res.status(400).send({ message: 'Bad request; no data to update' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorIndex = errorCheckInvalidFields(errors);
        //console.log("errors:", errors.array(), "at index:", errorIndex);
        if(errorIndex >= 0) return res.status(422).json({ errors: errors.array(), message: errors.array()[errorIndex].msg });
      }
      const user = await User.findByPk(id);
      if(user === null) return res.status(404).send({ message: "Entry not found!" });
      try{
        if(!password) password = user.password;
        else password = await hashPassword(password);
        
        if(!name) name = user.name;

        if(!email) email = user.email;
        //console.log("hashed Password:", password);
        user.set({
          name,
          password,
          email
        });
        await user.save();
        return res.status(200).send(user);
      }catch(error){
        return res.status(500).send({ error, message: "This Email is already registered." });
      }
    } catch (error) {
      return res.status(500).send({ error, message: "Internal server error." });
    }
};

//deletes a single user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.destroy({
            where: {
              id
            },
          });
        return res.status(200).send({message: "User with " + id + " was deleted successfuly!"});
      } catch (error) {
        return res.status(500).send({ error, message: "Internal server error." });
      }
};
module.exports = {
    getUsers,
    getUser,
    createUser,
    login,
    updateUser,
    deleteUser
  };