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
}

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
}

var decodeToken = function(tokenType) {
    return jwt.verify(tokenType , process.env.JWT_SECRET);
}

// exports module
exports.verifyCookieToken = (req, res, next) => { 
 var shortToken = cookie.parse(req.headers.cookie).shorttoken
 if(shortToken){
   try {
    var decodedShortToken = decodeToken(shortToken);
    User.findOne({
      where : { jwtId : decodedShortToken.jwtId }
    })
    .then(
      consoleHash("cookieShortToken : true, checkDB : true"),
      res.cookie("decodedShortToken" , decodedShortToken)
      .redirect('/')
    )
    .catch(err => done(err));
   } catch{
    consoleHash(err.name)
    delete shortToken
    res.redirect('/users/login')
   }
 } else{
    consoleHash("cookieShortToken : false, login")
    next();
 }
}
 
exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (authError, user) => {
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
        // #check2 => done
        const shortToken = signToken(user.email, "2hour");
        const decodedShortToken = decodeToken(shortToken);
        const longToken = signToken(decodedShortToken.jwtId, "2day");
        User.update({
          jwtId : jwt.verify(longToken, process.env.JWT_SECRET).jwtId,
        }, {
          where : {email : user.email}
        })
        // #check5
        res.cookie("shorttoken", shortToken)
        // for postman 
        res.set({"shorttoken" :  shortToken, "longtoken" : longToken});
        return  res.redirect("/")
        // res.send('send shortToken :\n'+shortToken+'\n'+'send longToken :\n'+longToken);
      });
    })(req, res, next);
}

exports.verifyToken = (req, res, next) => {
    
  // #check1
  // #check3 
  var shortToken = req.headers.shorttoken;
  var longToken = req.headers.longtoken;

  // #check4
  if (longToken) {
      try {
          consoleHash("long : true , short : true");
          req.decodedShortToken = decodeToken(shortToken);
          res.redirect('/');
      } catch (error) {
          const decodedLongTokenJwt = decodeToken(longToken);
          const checkDBLongToken = User.findOne({
              where : { jwtId : decodedLongTokenJwt.jwtId }
          });
          if (!checkDBLongToken) {
              delete longToken;
              res.redirect('/users/login');
          } else {
              const signedShortToken = signToken(decodedLongTokenJwt.id, "2hour");
              req.headers.shorttoken = signedShortToken;
              req.decodedShortToken = decodeToken(signedShortToken);
              consoleHash("long : true , short : false");
              res.redirect('/');
          }
      }
  } else {
      if(shortToken){
          var decodedShortToken = decodeToken(shortToken);
          const signedLongToken = signToken(decodedShortToken.id, "2day");
          User.update({
              jwtId : decodeToken(signedLongToken).jwtId,
              }, {
              where : {email : decodedShortToken.id}
              })
          req.headers.longtoken = signedLongToken;
          req.decodedShortToken = decodedShortToken;
          consoleHash("long : false , short : true");
          res.redirect('/');
      } else {
          var isLogin = path.parse(req.headers.referer).dir
          if(isLogin == 'http://localhost:3000/users') {
              consoleHash("long : false , short : false, referer : login");
              next();
          } else {
              consoleHash("long : false , short : false, referer : etc");
              res.redirect('/users/login')
          }
          
      }
  }
}
