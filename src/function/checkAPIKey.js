var {consoleWith, consoleHash} = require('./console');

module.exports = {
    checkApiKey : function (req, res, next) {
        consoleHash('check APIKey :' + req.headers.api_key)
        
        const api_key = req.headers.api_key;
        if (api_key && api_key === "nanakim") { 
            next();
        } else {
            res.sendStatus(401);
        }
    }
}