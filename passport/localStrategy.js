const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

/*
Send Form by Postman 
1) select Body
2) select x-www-urlencoded 
    for sending data type formField
  # Usually, we use raw, type JSON
  Both types are sended in req.body
*/ 

module.exports = () => {
  // used when passport.authenticate(), specifying the 'local' strategy, to authenticate requests.
  passport.use(new LocalStrategy(
  /*
  options
  Both fields define the name of properties(formFeild) in the POST body(req.body) that are sent to server
  */
  {
    usernameField: 'email',
    passwordField: 'password',
  }, 
  // verify callback
  async (email, password, done) => {
      try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
          // before making join api
          var result = false;
          if(password == exUser.password){
            result = true;
          }
          // after making join api
          // const result = await bcrypt.compare(password, exUser.password);
          if (result) {
            done(null, exUser);
          } else {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          }
        } else {
          done(null, false, { message: '가입되지 않은 회원입니다.' });
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  ));
};
