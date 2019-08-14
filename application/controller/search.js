// TODO:
//  getResults :
//      1. change basic query so that it returns a smaller list of reports if no parameters are passed in
//

const db = require('../auth/db_config.js')
const db_query = require('../database/db_query.js')

exports.getResults = function (data, callback) {
  // sets up the basics for the query
  var search_table = 'reports'
  var order_by_field = 'insert_date'

  db_query.buildSearchQuery(search_table, order_by_field, data).then(function (query) {
    db.query(query[0], query[1], function (err, result) {
      if (err) {
        console.log('Error querying database : ' + err)
        callback(err, null)
      } else { callback(null, result) }
    })
  })
}
