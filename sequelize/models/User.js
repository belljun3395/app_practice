const { DataTypes, Sequelize } = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Given_name: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: false,
      },
      Last_name : {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: false,
      },
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
  
  static associate(db) {
    db.User.hasMany(db.Data);
    db.User.hasOne(db.Icon);
  }
};