var passport = require('passport');
var local = require('./localStrategy');
var User = require('../sequelize/models/User');

module.exports = () => {

    local();

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findOne({
        where: { id }
      })
      .then(user => done(null, user))
      .catch(err => done(err));
    });
};