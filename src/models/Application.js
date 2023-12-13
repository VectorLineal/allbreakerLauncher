const { DataTypes } = require('sequelize');
const { dbInstance } = require('../connection');

const Application = dbInstance.define('Application', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        notEmpty: true
      }
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'applications'
  });

  module.exports = {
    Application
  };