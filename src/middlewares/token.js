var { v4: uuidv4 } = require('uuid'),
    path = require('path'),
    passport = require('passport'),
    cookie = require('cookie'),
    User  = require('../../sequelize/models/User');

// function
var { signToken, decodeToken} = require('../function/token');
var { consoleWith } =require('../function/console');


// exports module
exports.verifyToken = (req, res, next) => {

    var shortToken = req.headers.shorttoken;
    var longToken = req.headers.longtoken;
  
    if (longToken) {
        try {
            consoleWith("#", "long : true , short : true");
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
                consoleWith("#", "long : true , short : false");
                res.redirect('/');
            };
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
            consoleWith("#", "long : false , short : true");
            res.redirect('/');
        } else {
            var isLogin = path.parse(req.headers.referer).dir;
            if(isLogin == 'http://localhost:3000/users') {
                consoleWith("#", "long : false , short : false, referer : login");
                next();
            } else {
                consoleWith("#", "long : false , short : false, referer : etc");
                res.redirect('/users/login');
            }
            
        };
    };
  };
  
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
          consoleWith("#", "cookieShortToken : true, checkDB : true");
          res.send(exUser);
          } catch(err) {
            delete shortToken;
            delete decodedShortToken;
            res.redirect('/users/login');
          }
        } catch(err){
        consoleWith("#", err.name);
        delete shortToken;
        delete decodedShortToken;
        res.redirect('/users/login');
        }
      } else {
        consoleWith("#", "reqCookie.shorttoken : false, login");
        next();
      }
      
    } else {
      consoleWith("#", "cookieShortToken : false, login");
      next();
    };
  };
  
  exports.verifyJwtToken = (req, res, next) => {
    var headerAuth = req.header("authorization");
    consoleWith("#", headerAuth)
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