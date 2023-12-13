const { DataTypes } = require('sequelize');
const { dbInstance } = require('../connection');
const { Application } = require('./Application');
const { User } = require('./User');

const Content = dbInstance.define('Content', {
    available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate:{
        min: 0
      }
    }
  }, {
    timestamps: true,
    tableName: 'contents'
  });

  User.hasMany(Content, { as: 'contents', foreignKey: 'userId' });
  Application.hasMany(Content, { as: 'contents', foreignKey: 'applicationId' });
  Content.belongsTo(User, {
    foreignKey: "userId",
    allowNull: false
  });
  Content.belongsTo(Application, {
    foreignKey: "applicationId",
    allowNull: false
  });
module.exports = {
  Content
};