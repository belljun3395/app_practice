var express = require('express'),
    cookie = require('cookie'),
    router = express.Router();  
    

var consoleHash = function(innerText) {
  console.log("#######################");
  console.log(innerText);
  console.log("#######################");
};
  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
