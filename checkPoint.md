# app.js

## check1
initialize() method setups the functions to serialize/deserialize the user data from the request.<br>
why initialize method use before session method?<br>

# src/route/middelwares.js

## check1 
at req.headers, there is no difference between upper and lower<br>

## check2
how to make below jwt.sign to function<br>

## workflow

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

# passport/index.js

## how to work passport 
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

## how to use Postman
Send Form by Postman 

1) select Body
2) select x-www-urlencoded for sending data type formField<br>
  ( Usually, we use raw, type JSON )

Both types are sended in req.body

## strategy options
Both fields define the name of properties(formFeild) in the POST body(req.body) which are sent to server

# sequelize/models/User.js

Models can be defined in two ways in Sequelize.
1) Calling
: sequelize.define(modelName, attributes, options)
2) Extending Model and calling
: init(attributes, option)

## check1
in attributes we need sequelize to make instance

# sequelize/models/index.js

## check1
for exports 
```
const db = {};
db.User = User;
db.sequelize = sequelize; 
```
