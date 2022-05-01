// middlewares/verify

exports.verifyToken = (req, res, next) => {
    
    // #check1 => done
    // #check3 => done
    var shortToken = req.headers.shorttoken;
    var longToken = req.headers.longtoken;
  
    // #check4 => done
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
            consoleHash("long : false , short : true");
            res.redirect('/');
        } else {
            var isLogin = path.parse(req.headers.referer).dir;
            if(isLogin == 'http://localhost:3000/users') {
                consoleHash("long : false , short : false, referer : login");
                next();
            } else {
                consoleHash("long : false , short : false, referer : etc");
                res.redirect('/users/login');
            }
            
        };
    };
  };