const express = require('express');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/UserRoutes");
const applicationRoutes = require("./routes/ApplicationRoutes");
const contentRoutes = require("./routes/ContentRoutes");
const securityQuestionRoutes = require("./routes/SecurityQuestionRoutes");
const { dbInstance } = require('./connection');

const app = express ();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());

dbInstance.authenticate().then(() => {
  console.log('Connection success');
  return dbInstance.sync();
}).then(() => {
  console.log('Sync models');
  app.listen(PORT, () => {
    console.log(`Server listen on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Connection failed', error);
});

app.use("/api", userRoutes);
app.use("/api", applicationRoutes);
app.use("/api", contentRoutes);
app.use("/api", securityQuestionRoutes);

app.get('/status', (req, res) => {
    return res.status(200).send({ message: "Launcher API initialized" }); 
  });
