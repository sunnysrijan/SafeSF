const db = require('../auth/db_config.js')

exports.getResults = function(data, callback) {

    console.log(data)

    var search_query = 'SELECT * FROM reports'
    var where_clause = 'WHERE '
    var where_count = 0
    
    if(data) {

        callback(null, data)
        // if(data['category'])
        // {
        //     where_clause = where_clause + "category = " + data['category']
        //     where_count++
        // }
        // if(data['neighborhood'])
        // {
        //     if(where_count > 0)
        //     {
        //         where_clause = where_clause + " AND "
        //     }
        //     where_clause = where_clause + "neighborhood = " 
        // }
    }

    callback(null, where_clause)

    // db.query(search_query, function(err, result) {
    //     if(err) {
    //         console.log("Error querying database : " + err)
    //         callback(err, null)
    //     }
    //     else {
    //         console.log("Results succesfully retrieved")
    //         callback(null, result)
    //     }
    // })
}