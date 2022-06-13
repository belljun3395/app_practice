var express = require('express'),
    router = express.Router(),
    { graphqlHTTP } = require('express-graphql');


var { verifyJwtToken, verifyCookieToken } =require('../middlewares/token')
var { authenticate, join } = require('../middlewares/verify');
var { graphqlTest } = require('../middlewares/graphql');
var { schema, rootValue } = require('../../grqphql/models/index')

var multer = require("../middlewares/multerObj");

/* GET sign in page. */
router.get('/login', verifyJwtToken, function(req,res) {
    res.send("Login Pleaze");
})

router.post('/login', verifyCookieToken, authenticate );

router.post('/loginjwt',  verifyCookieToken);

router.post('/image', multer.single("fieldName"), function(req,res){
    res.send(req.file)
});

router.post('/postman/join', join)

router.post('/postman/graphql', graphqlTest)


router.use('/test/graphql', graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true,
  }));

module.exports = router;
