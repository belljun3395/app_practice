const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./User');

// connecting to a database
const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);

// #check for exports 
const db = {};
db.User = User;
db.sequelize = sequelize; 

// Sequelize adds a getter & a setter for each attribute defined through Model.init
User.init(sequelize);

module.exports = db;