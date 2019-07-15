const db = require('../auth/db_config.js')

exports.getResults = function(data, callback) {

    console.log(data)

    var search_query = 'SELECT * FROM reports'
    var where_clause = ' WHERE'
    var order_clause = ' ORDER BY report_insert_date DESC'
    var where_count = 0
    var values = []
    
    if(data) {
        
        for(var [key, value] of Object.entries(data))
        {
            if(where_count > 0)
            {
                where_clause = where_clause + " AND "
            }
            if(key === 'user_entry')
            {
                where_clause += " report_details = ?"
                where_count++
                value = "%" + value + "%"
                values.push(value)
            }
            else
            {
                where_clause = where_clause + " " + key + " = ?"
                where_count++
                values.push(value)
            }
        }
        if(where_count > 0)
        {
            search_query = search_query + where_clause + order_clause
        }
    }

    console.log(search_query)

    db.query(search_query, values, function(err, result) {
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