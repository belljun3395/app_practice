const Data = require('../../sequelize/models/Data');


exports.dataValue = {
    data : async (user) => { return (await Data.findAll({where : {UserId : user.id}}))[0] },
    dataTest : async (user) => {var data = await Data.findAll({where : {UserId : user.id}}); return data[0]} 
    // Have to solve findAll problem!
}