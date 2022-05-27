var jwt = require('jsonwebtoken'),
    { v4: uuidv4 } = require('uuid'),
    path = require('path'),
    passport = require('passport'),
    cookie = require('cookie'),
    User  = require('../../sequelize/models/User');

// function
var {signToken, decodeToken} = require('../function/token')


// exports module
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
        const shortToken = signToken(user.email, "2hour");
        const decodedShortToken = decodeToken(shortToken);
        const longToken = signToken(decodedShortToken.jwtId, "2day");
        User.update({
          jwtId : jwt.verify(longToken, process.env.JWT_SECRET).id,
        }, {
          where : {email : user.email}
        })
        res.cookie("shorttoken", shortToken);
        res.set("authorization", shortToken);
        return res.redirect('send shortToken :\n'+shortToken+'\n'+'send longToken :\n'+longToken);
      });
    })(req, res, next);
};


exports.join = async (req, res, next) => {
  const { email, password, Given_name, Last_name } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    await User.create({
      email,
      password,
      Given_name,
      Last_name
    });
    userIdData = await User.findOne({where : {email}});
    await Icon.create({linkedin : "0", github : "0", facebook : "0", twitter : "0", UserId : userIdData.id})
    return res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}


exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/users/login');
  }
};