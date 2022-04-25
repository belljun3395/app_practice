const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../sequelize/models/User');


module.exports = () => {
  passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  }, 
  async (email, password, done) => {
      try {
        // #check1  
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
          // before making join api
          var result = false;
          if(password == exUser.password){
            result = true;
          };
          /* 
          after making join api
          const result = await bcrypt.compare(password, exUser.password);
          */
          if (result) {
            done(null, exUser);
          } else {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
          };
        } else {
          done(null, false, { message: '가입되지 않은 회원입니다.' });
        };
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  ));
};
