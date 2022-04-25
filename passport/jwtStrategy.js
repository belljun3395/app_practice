var passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../sequelize/models/User');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jwtSecret';
opts.issuer = "jongjun"

module.exports = () => {
    // #check1 
    passport.use("jwt", new JwtStrategy(opts, async function(jwt_payload, done) {
        const exUser = await User.findOne({ where : { jwtId : jwt_payload.jwtId }});
        if(exUser){
            done(null, exUser)
        } else {
            done(null, false);
        }
    }));
}