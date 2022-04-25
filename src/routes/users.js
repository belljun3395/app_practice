var express = require('express'),
    router = express.Router();

var { verifyToken,verifyCookieToken ,authenticate } = require('./middlewares');

router.post('/login', verifyCookieToken, authenticate );

module.exports = router;
