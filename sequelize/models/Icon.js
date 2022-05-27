const { DataTypes, Sequelize } = require('sequelize');

module.exports = class Icon extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      linkedin: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue : '0'
      },
      github: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue : '0'
      },
      twitter: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue : '0'
      },
      facebook: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue : '0'
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Icon',
      tableName: 'Icons',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Icon.belongsTo(db.User);
  }
};