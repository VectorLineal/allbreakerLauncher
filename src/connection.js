const { Sequelize } = require('sequelize');

const USER = process.env.DB_USER;
const PASSWORD = process.env.PASSWORD;
const database = process.env.DATABASE;
const host = process.env.DB_HOST;
const dbInstance = new Sequelize(database, USER, PASSWORD, {
  host,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
module.exports = {
  dbInstance
}
