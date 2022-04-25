# app.js

## ~check1~
initialize() method setups the functions to serialize/deserialize the user data from the request.
why initialize method use before session method?
---
initialize method make passport instance 

# src/route/middelwares.js

## ~check1~ 
at req.headers, there is no difference between upper and lower

## ~check2~
how to make below jwt.sign to function

## check3
how to push token into Authorization header

## check4
how to send res.headers on res.redirect

## check5
send jwt token by cookie? or authorization?

## check6
how to handle false?

## Workflow

1) check long&short Token in req.headers. 
2) if there is no token make token.
3) there are all token exist send req.decodedShortToken
```
shortToken = req.headers.shorttoken || false;
longToken = req.headers.longtoken || false;

longToken => true :
    shortToken => true
        : req.decodedShortToken => res.redirect('/')
    shortToken => false
        : check DB => false
            : delete longToken => res.redirect('/users/login')
        : check DB => true
            : make shorToken, req.headers.authorization.shorttoken and req.decodedShortToken
                => res.redirect('/')
longToken => false :
    shortToken => true
        : make longToken, update DB jwtId, req.headers.authorization.longtoken and req.decodedShortToken
            => res.redirect('/')
    shortToken => false
        : referer => login
            : next()
        : referer => etc
            : res.redirect('/users/login')
```
```
shortToken = cookie.parse(req.headers.cookie).shorttoken
shortToken 
=> true :
        check DB is shortToken id == longToken id 
        => true : res.cookie(decodedShortToken) & res.redirect('/')
        => false : delete req.headers.cookeie.shorttoken & res.redirect('/users/login')
=> false : 
        res.redirect('/users/login')
```

# passport/index.js

## How to work passport 
```
passport.serializeUser(function(user, done) {
        done(null, user.id);
});                 │
                    │ 
                    │
                    └─────────────────┬──→ saved to session
                                      │    req.session.passport.user = {id: '..'}
                                      │
                                      ↓           
        passport.deserializeUser(function(id, done) {
                        ┌───────────────┘
                        │
                        ↓ 
        User.findById(id, function(err, user) {
            done(err, user);
        });            └──────────────→ user object attaches to the request as req.user   
});
```

# passport/localStrategy.js

## check1 
select exUser's information

## How to use Postman
Send Form by Postman 

1) select Body
2) select x-www-urlencoded for sending data type formField
    ( Usually, we use raw, type JSON )

Both types are sended in req.body

## Strategy options
Both fields define the name of properties(formFeild) in the POST body(req.body) which are sent to server

# passport/jwtStrategy.js

## check1 
select exUser's information

# sequelize/models/User.js

Models can be defined in two ways in Sequelize.
1) Calling
: sequelize.define(modelName, attributes, options)
2) Extending Model and calling
: init(attributes, option)

## check1
in attributes, sequelize make instance?

# sequelize/models/index.js

## check1
for exports?
```
const db = {};
db.User = User;
db.sequelize = sequelize; 
```
