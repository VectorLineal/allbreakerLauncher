const { Sequelize } = require('sequelize');

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const database = process.env.DATABASE;
const host = process.env.DB_HOST;

const dbInstance = new Sequelize(database, USER, PASSWORD, {
  host,
  dialect: 'postgres',
});
module.exports = {
  dbInstance
}