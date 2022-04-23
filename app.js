// add npm  
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var sequelize = require('./sequelize/models').sequelize
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

// add config  
var dotenv = require('dotenv');
var passportConfig = require('./passport');

// add router  
var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');

// serverStart  
dotenv.config();
sequelize.sync();
passportConfig();

var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup  
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/src/public')));

// middleware  
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : process.env.SESSION_SECRET,
  cookie : {
    httpOnly : true,
    secure : false,
  },
}));

// #check1 => done
app.use(passport.initialize());
app.use(passport.session());

// routerMiddleware  
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler  
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler  
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

module.exports = app;
