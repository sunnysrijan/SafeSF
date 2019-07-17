const db = require('../auth/db_config.js')
const db_query = require('../database/db_query.js')

exports.getLocations = function(callback) {
    db.query("SELECT * FROM locations", function(err, result) {
        if(err) {
            console.log("Error querying database : " + err)
            callback(err, null)
        }
        else {
            console.log("Results succesfully retrieved")
            callback(null, result)
        }
    })
}