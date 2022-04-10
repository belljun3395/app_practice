var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var { v4: uuidv4 } = require('uuid');
var path = require('path');

var { verifyToken } = require('./middlewares');
var User  = require('../models/User');

router.post('/login', verifyToken, (req, res, next) => {
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
      // #check how to make below jwt.sign to function
      const longToken =  jwt.sign(
        {
          id : user.email,
          jwtId : uuidv4()
        },
        process.env.JWT_SECRET, 
        {
          expiresIn: "2day", 
          issuer: 'jongjun',
        });
        const shortToken =  jwt.sign(
          {
            id : user.email,
            jwtId : uuidv4()
          },
          process.env.JWT_SECRET, 
          {
            expiresIn: "2hour", 
            issuer: 'jongjun',
          });
      User.update({
        jwtId : jwt.verify(longToken, process.env.JWT_SECRET).jwtId,
      }, {
        where : {email : user.email}
      })
      return res.send('send shortToken :\n'+shortToken+'\n send longToken :\n'+longToken);
    });
  })(req, res, next);
});

module.exports = router;
