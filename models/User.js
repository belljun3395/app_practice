const { DataTypes, Sequelize } = require('sequelize');

/* 
Models can be defined in two ways in Sequelize.
1) Calling
: sequelize.define(modelName, attributes, options)
2) Extending Model and calling
: init(attributes, option)
#check in attributes we need to use Sequelize method
*/ 

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      jwtId : {
        type: DataTypes.STRING(100),
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
};