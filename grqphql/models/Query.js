exports.QuerySchema = `type Query {
    user(id : Int) : User
    data(id : Int) : Data
    dataTest(id : Int) : Data
    test : String
  }`