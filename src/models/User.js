const { DataTypes } = require('sequelize');
const { dbInstance } = require('../connection');

const User = dbInstance.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
          notEmpty: true,
          isEmail: true
        }
    }
  },
  {
    timestamps: true,
    tableName: 'users'
  }
);

module.exports = {
  User
};