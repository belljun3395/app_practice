var express = require('express'),
    passport = require('passport'),
    router = express.Router();

var { verifyToken, verifyJwtToken, verifyCookieToken,authenticate } = require('./middlewares');

router.post('/login', verifyCookieToken, authenticate );
router.post('/loginverify',  verifyJwtToken,
    function(req,res){
        res.send(req.user);
});


module.exports = router;
