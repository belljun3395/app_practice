var passport = require('passport');
var local = require('./localStrategy');

module.exports = () => {

    local();
    
    // write user.id data in session 
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    // use user.id data in session
    passport.deserializeUser((id, done) => {
      User.findOne({
        where: { id },
        include: [{
          model: User,
          attributes: ['id', 'nick'],
        }, {
          model: User,
          attributes: ['id', 'nick'],
        }],
      })
      .then(user => done(null, user))
      .catch(err => done(err));
    });

};