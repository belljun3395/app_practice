const Data = require('../../sequelize/models/Data');


exports.dataValue = {
    data : async (user) => { return (await Data.findAll({where : {UserId : user.id}}))[0] },
    dataArray : async (user) => { return await Data.findAll({where : {UserId : user.id}}) } 
}