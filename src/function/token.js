var jwt = require('jsonwebtoken'),
    { v4: uuidv4 } = require('uuid');


exports.signToken = function (idSource, expiresTime) {
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

exports.decodeToken = function(tokenType) {
    return jwt.verify(tokenType , process.env.JWT_SECRET);
};