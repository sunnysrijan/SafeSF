const db = require('../auth/db_config.js')
const db_query = require('../database/db_query.js')

exports.getLocations = function (callback) {
  db.query('SELECT * FROM locations', function (err, result) {
    if (err) {
      console.log('Error querying database : ' + err)
      callback(err, null)
    } else {
      console.log('Results succesfully retrieved')
      callback(null, result)
    }
  })
}

// Queries the DB and gets the number of locations in the database.
exports.getNumberOfLocations = function () {
  return new Promise(function(resolve, reject) {
    var result = db.query('SELECT COUNT(*) AS numLocations FROM locations', function (err, result) {
      if (err) {
        reject(null)
      } else {
        resolve(result[0].numLocations)
      }
    })
  })
}
