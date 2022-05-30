exports.QuerySchema = `type Query {
    user(id : Int) : User
    data(id : Int) : Data
    dataArray(id : Int) : [Data]
    test : String
  }`