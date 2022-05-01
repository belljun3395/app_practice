var express = require('express'),
    router = express.Router(),
    multer  = require('multer'),
    path = require('path'),
    fs = require('fs');

var { verifyJwtToken, verifyCookieToken,authenticate } = require('../middlewares/verify');


try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
  
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/login', verifyCookieToken, authenticate );
router.post('/loginjwt',  verifyJwtToken);


router.post('/image', upload.single("fieldName"), function(req,res){
    console.log(req.file)
    res.send(req.file)
});


router.get('/login', function(req,res) {
    res.send("Login Pleaze");
})


module.exports = router;
