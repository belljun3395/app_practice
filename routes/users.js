var express = require('express');
var router = express.Router();

var { verifyToken, authenticate } = require('./middlewares');

router.post('/login', verifyToken, authenticate );

module.exports = router;
