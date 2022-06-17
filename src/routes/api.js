var express = require('express'),
    router = express.Router();

const { swaggerUi, specs } = require('../modules/swagger.js');
const sign = require('../function/checkAPIKey');

/* GET home page. */
router.use('/' , swaggerUi.serve, swaggerUi.setup(specs), sign.checkApiKey);


module.exports = router;