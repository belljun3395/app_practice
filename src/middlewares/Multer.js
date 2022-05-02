const multer  = require('multer'),
    path = require('path'),
    fs = require('fs');

class MulterClass {

    constructor() {
        try {
            fs.readdirSync('uploads');
            } catch (error) {
            console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
            fs.mkdirSync('uploads');
            }
            
        this.upload = multer({
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
    }
        
    single(fieldName) {
        return this.upload.single(fieldName)
    }

    array(fieldName, count) {
        return this.upload.array(fieldName, count)
    }
    
    fields (arrayField) {
        return this.upload.fields(arrayField)
    } 
}
    
    
module.exports = MulterClass

