// function
exports.consoleHash = function(innerText) {
    console.log("#######################");
    console.log(innerText);
    console.log("#######################");
};

exports.consoleWith = function( icon, innerText) {
    var result = ""
    for (var i = 0; i < 100 ; i++) {
        result += icon;
    }
    console.log(result)
    console.log(innerText)
    console.log(result)
}