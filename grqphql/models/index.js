var { buildSchema } = require('graphql');

var {DataSchema} = require('./Data')
var {UserSchema} = require('./User')
var {QuerySchema} = require('./Query')
var Schema = QuerySchema.concat(UserSchema,DataSchema)


var {dataValue} = require('../rootValue/data')
var {userValue} = require('../rootValue/user')

var {sourceValue} = require('../../src/middlewares/graphqlSource')




// Construct a schema, using GraphQL schema language
exports.schema = buildSchema(`${Schema}`);

exports.rootValue = {
    user : userValue.user,
    data : dataValue.data,
    dataArray : dataValue.dataArray,
    test : () => { return "hello"}
};


exports.source = sourceValue