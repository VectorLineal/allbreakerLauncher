const { DataTypes } = require('sequelize');
const { dbInstance } = require('../connection');
const { User } = require('./User');

const SecurityQuestion = dbInstance.define('SecurityQuestion', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notEmpty: true
        }
    }
  }, {
    timestamps: true,
    tableName: 'security_questions'
  });

  User.hasMany(SecurityQuestion, { as: 'security_questions', foreignKey: 'userId' });
  SecurityQuestion.belongsTo(User, {
    foreignKey: "userId",
    allowNull: false
  });

  module.exports = {
    SecurityQuestion
  };