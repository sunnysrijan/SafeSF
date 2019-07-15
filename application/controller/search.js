// TODO:
//  getResults :
//      1. change basic query so that it returns a smaller list of reports if no parameters are passed in
//      


const db = require('../auth/db_config.js')

exports.getResults = function(data, callback) {

    console.log(data)

    //sets up the basics for the query 
    var search_query = 'SELECT * FROM reports'
    var where_clause = ' WHERE'
    var order_clause = ' ORDER BY report_insert_date DESC'
    var where_count = 0
    var values = []
    
    //checks if any parameters have been sent
    //if not it grabs the whole list
    if(data) {
        
        //for each parameter sent in it adds a condition to the where clause
        //values are pushed into the values array
        for(var [key, value] of Object.entries(data))
        {
            if(where_count > 0)
            {
                where_clause = where_clause + " AND "
            }
            //user entry is a special case
            //this parameter must have a % LIKE wrapped around it
            if(key === 'user_entry')
            {
                where_clause += " report_details LIKE ?"
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
        else
        {
            search_query = search_query + order_clause
        }
    }

    //output for debugging purposes on the server
    console.log(search_query)

    //values array is passed in to bind the parameter values to the query
    //this projects against sql injections and is necessary
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