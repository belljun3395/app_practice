var jwt = require('jsonwebtoken');
var { v4: uuidv4 } = require('uuid');
var path = require('path');
var User  = require('../models/User');

exports.verifyToken = (req, res, next) => {
    /* 
    # workflow
    longToken => true : 
        shortToken => true 
            : req.decodedShortToken => res.redirect('/')
        shortToken => false 
            : check DB => false
                : delete longToken and back to GET /users/login
            : check DB => true 
                : make shorToken, req.headers.authorization.shorttoken and req.decodedShortToken => next()
    longToken => false : 
        shortToken => true 
            : make longToken, update DB jwtId and req.decodedShortToken => next()
        shortToken => false 
            : referer => login 
                : next()
            : reforer => etc
                : back to login page
    */
    
    // #check at req.headers, there is no difference between upper and lower
    const shortToken = req.headers.shorttoken || false;
    const longToken = req.headers.longtoken || false;

    var decodeToken = function(type) {
        jwt.verify(type , process.env.JWT_SECRET);
    }

    if (longToken) {
        try {
            console.log("##########################")
            console.log("long : true , short : true")
            req.decodedShortToken = decodeToken(longToken);
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
                    const makeShortToken = jwt.sign(
                        { 
                            id : decodedLongTokenJwt.id,
                            jwtId : uuidv4(),
                        },
                        process.env.JWT_SECRET, 
                        { 
                            expiresIn: "2hour", 
                            issuer: 'jongjun',
                        }
                    );
                    req.headers.authorization.shorttoken = makeShortToken;
                    req.decodedShortToken = decodeToken(makeShortToken);
                    console.log("##########################")
                    console.log("long : true , short : false");
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
            const makeLongToken =  jwt.sign(
                {
                    id : decodedShortToken.id,
                    jwtId : uuidv4(),
                },
                process.env.JWT_SECRET, 
                {
                    expiresIn: "2day", 
                    issuer: 'jongjun',
                });
            User.update({
                jwtId : decodeToken(makeLongToken).jwtId,
                }, {
                where : {email : decodedShortToken.id}
                })
            req.decodedShortToken = decodedShortToken;
            console.log("##########################")
            console.log("long : false , short : true")
            next();
        } else {
            var isLogin = path.parse(req.headers.referer).dir
            if(isLogin == 'http://localhost:3000/users') {
                console.log("##########################")
                console.log("long : false , short : false, referer : login")
                next();
            } else {
                console.log("##########################")
                console.log("long : false , short : false, referer : etc")
                res.redirect('/users/login')
            }
            
        }
    }
}

