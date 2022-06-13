// add npm  
var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    sequelize = require('./sequelize/models').sequelize,
    session = require('express-session'),
    // redis = require('redis'),
    // RedisStore = require('connect-redis')(session),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    helmet = require('helmet'),
    hpp = require('hpp');

const { swaggerUi, specs } = require('./src/modules/swagger');
const sign = require('./src/function/checkAPIKey');
const logger = require('./logger/logger.js');

// add config  
var dotenv = require('dotenv'),
    passportConfig = require('./passport');

// add router  
var indexRouter = require('./src/routes/index'),
    usersRouter = require('./src/routes/users');

// serverStart  
dotenv.config();
sequelize.sync();
passportConfig();

// start express
var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup  
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/src/public')));

// middleware  
if(process.env.NODE_ENV==='production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// const redisClient = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
//   logError: true
// });
const sessionOption = {
  resave : false,
  saveUninitialized : false,
  secret : process.env.SESSION_SECRET,
  cookie : {
    httpOnly : true,
    secure : false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// routerMiddleware  
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(sign.checkApiKey);

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
