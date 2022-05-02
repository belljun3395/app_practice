var express = require('express'),
    router = express.Router();

var { verifyJwtToken, verifyCookieToken,authenticate } = require('../middlewares/verify');
var multer = require("../middlewares/multerObj");

router.post('/login', verifyCookieToken, authenticate );
router.post('/loginjwt',  verifyJwtToken);
router.post('/image', multer.single("fieldName"), function(req,res){
    console.log(req.file)
    res.send(req.file)
});

router.get('/login', function(req,res) {
    res.send("Login Pleaze");
})

module.exports = router;
