const { DataTypes, Sequelize } = require('sequelize');

module.exports = class Data extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      Etitle: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Esubtitle: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Ecomment: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Edtitle: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Edsubtitle: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Edcomment: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      Ilist: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
      AClist: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Data',
      tableName: 'datas',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.Data.belongsTo(db.User);
  }
};