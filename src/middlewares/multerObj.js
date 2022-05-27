var Multer = require("./Multer");

multerObj = new Multer();


// exports module
exports.single = (fieldName) => {
    return multerObj.single(fieldName);
}

exports.array = (fieldName, count) => {
    return multerObj.array(fieldName, count);
}

exports.fields = (array) => {
    return multerObj.fields(array);
}