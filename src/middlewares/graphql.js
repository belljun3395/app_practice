var { graphql } = require('graphql');
var { schema, rootValue, source } = require('../../grqphql/models/index')


exports.graphqlTest = async (req, res) => {
    var result =  await graphql({ schema,source,rootValue })
    res.send(result)
  }