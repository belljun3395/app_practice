var jwt = require('jsonwebtoken');
var { v4: uuidv4 } = require('uuid');
var path = require('path');
var passport = require('passport');
var User  = require('../../sequelize/models/User');

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
          issuer: 'jongjun',
        });
}

var decodeToken = function(tokenType) {
    return jwt.verify(tokenType , process.env.JWT_SECRET);
}

// exports module
exports.verifyToken = (req, res, next) => {
    
    // #check1 
    const shortToken = req.headers.shorttoken || false;
    const longToken = req.headers.longtoken || false;

    if (longToken) {
        try {
            consoleHash("long : true , short : true");
            req.decodedShortToken = decodeToken(shortToken);
            res.redirect('/');
        } catch (error) {
            if (error.name === 'TokenExpiredError') { 
                const decodedLongTokenJwt = decodeToken(longToken);
                const checkDBLongToken = User.findOne({
                    where : { jwtId : decodedLongTokenJwt.jwtId }
                });
                if (!checkDBLongToken) {
                    delete longToken;
                    res.redirect('/users/login');
                } else {
                    const signedShortToken = signToken(decodedLongTokenJwt.id, "2hour");
                    req.headers.authorization.shorttoken = signedShortToken;
                    req.decodedShortToken = decodeToken(signedShortToken);
                    consoleHash("long : true , short : false");
                    res.redirect('/');
                }
            }
            return res.status(401).json({
                code: 401,
                message : '유효하지 않은 토큰입니다',
            });
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
            req.headers.authorization.longtoken = signedLongToken;
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

exports.authenticate = (req, res, next) => {
    
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
        // #check2 
        const longToken = signToken(user.email, "2day");
        const shortToken = signToken(user.email, "2hour");
        User.update({
          jwtId : jwt.verify(longToken, process.env.JWT_SECRET).jwtId,
        }, {
          where : {email : user.email}
        })
        return res.send('send shortToken :\n'+shortToken+'\n'+'send longToken :\n'+longToken);
      });
    })(req, res, next);
}

