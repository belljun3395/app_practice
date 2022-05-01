var jwt = require('jsonwebtoken'),
    { v4: uuidv4 } = require('uuid'),
    path = require('path'),
    passport = require('passport'),
    cookie = require('cookie'),
    User  = require('../../sequelize/models/User');

// function
var consoleHash = function(innerText) {
    console.log("#######################");
    console.log(innerText);
    console.log("#######################");
};

var signToken = function (idSource, expiresTime) {
    return jwt.sign(
        {
          id : idSource,
          jwtId : uuidv4()
        },
        process.env.JWT_SECRET, 
        {
          expiresIn: expiresTime, 
          issuer: process.env.JWT_ISSUER,
        });
};

var decodeToken = function(tokenType) {
    return jwt.verify(tokenType , process.env.JWT_SECRET);
};

// exports module

exports.verifyCookieToken = async (req, res, next) => { 
  if(req.headers.cookie){
    var reqCookie = cookie.parse(req.headers.cookie);
    if(reqCookie.shorttoken) {
      var shortToken =reqCookie.shorttoken;
      var decodedShortToken = decodeToken(shortToken);
      try {
        try{
          var exUser = await User.findOne({
              where : { jwtId : decodedShortToken.jwtId }
            })
        consoleHash("cookieShortToken : true, checkDB : true");
        res.send(exUser);
        } catch(err) {
          delete shortToken;
          delete decodedShortToken;
          res.redirect('/users/login');
        }
      } catch(err){
      consoleHash(err.name);
      delete shortToken;
      delete decodedShortToken;
      res.redirect('/users/login');
      }
    } else {
      consoleHash("reqCookie.shorttoken : false, login");
      next();
    }
    
  } else {
    consoleHash("cookieShortToken : false, login");
    next();
  };
};

exports.verifyJwtToken = (req, res, next) => {
  var headerAuth = req.header("authorization");
  if( headerAuth == undefined ){
    res.redirect('/users/login');
  } else {
    passport.authenticate('jwt', { session : false },(authError, user)=> {
      if (authError) {
        console.error(authError);
        return next(authError);
      };
      if (!user) {
        return res.send('NO EXISTING USER');
      };
      return res.send(user);
      })(req,res,next);
  };
};

exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (authError, user) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      };
      if (!user) {
        return res.send('NO EXISTING USER');
      };
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        };
        // #check2 => done
        const shortToken = signToken(user.email, "2hour");
        const decodedShortToken = decodeToken(shortToken);
        const longToken = signToken(decodedShortToken.jwtId, "2day");
        User.update({
          jwtId : jwt.verify(longToken, process.env.JWT_SECRET).id,
        }, {
          where : {email : user.email}
        })
        // #check5 => done
        res.cookie("shorttoken", shortToken);
        res.set("authorization", shortToken);
        return res.send('send shortToken :\n'+shortToken+'\n'+'send longToken :\n'+longToken);
      });
    })(req, res, next);
};


