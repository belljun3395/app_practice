var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var { v4: uuidv4 } = require('uuid');
var User  = require('../models/User');

var makeJwt = function (expireHours) {
  jwt.sign(
    {
      id : user.email,
      jwtId : uuidv4()
    },
    process.env.JWT_SECRET, 
    {
      expiresIn: expireHours, 
      issuer: 'jongjun',
    });
}

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send('NO EXISTING USER');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      const shorttoken = makeJwt('2h');
      const longtoken = makeJwt('7d');
      
      // update user's longtoken.jwtId
      User.update({
        jwtId : jwt.verify(longtoken,process.env.JWT_SECRET).jwtId,
      }, {
        where : {email : user.email}
      })
      return res.send('success\n'+shorttoken+'\n'+longtoken);
    });
  })(req, res, next);
});

module.exports = router;
