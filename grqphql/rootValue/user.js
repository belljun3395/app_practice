const User = require('../../sequelize/models/User');


exports.userValue = {
    user : async (user) => { return await User.findOne({where : {id : user.id}}) },
};
