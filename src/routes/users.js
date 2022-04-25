var express = require('express'),
    passport = require('passport'),
    router = express.Router();

const res = require('express/lib/response');
var { verifyToken, verifyJwtToken, verifyCookieToken,authenticate } = require('./middlewares');

router.post('/login', verifyCookieToken, authenticate );
router.post('/loginjwt',  verifyJwtToken,
    function(req,res){
        res.send(req.user);
    }
);

router.get('/login', function(req,res) {
    res.send("Login Pleaze");
})


module.exports = router;
