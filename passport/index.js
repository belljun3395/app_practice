var passport = require('passport');
var local = require('./localStrategy');
var User  = require('../models/User');

module.exports = () => {

    local();
    
    // user is from Local strategy exUser
    // write user.id data in req.session.passport 
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    // use id data in req.session.passport.user.id
    passport.deserializeUser((id, done) => {
      User.findOne({
        where: { id }
      })
      .then(user => done(null, user))
      .catch(err => done(err));
    });

    /* 
    passport.serializeUser(function(user, done) {
          done(null, user.id);
    });                 │
                        │ 
                        │
                        └─────────────────┬──→ saved to session
                                          │    req.session.passport.user = {id: '..'}
                                          │
                                          ↓           
            passport.deserializeUser(function(id, done) {
                          ┌───────────────┘
                          │
                          ↓ 
            User.findById(id, function(err, user) {
                done(err, user);
            });            └──────────────→ user object attaches to the request as req.user   
    });
    */
};