
exports.buildSearchQuery = function(table, order, params){

    var query = `SELECT * FROM ${table}`
    var where_clause = ' WHERE'
    var order_clause = ` ORDER BY ${order} DESC`
    var where_count = 0
    var values = []
    
    return new Promise(function(resolve, reject){
        //checks if any parameters have been sent
        //if not it grabs the whole list
        if(params) 
        {
            //for each parameter sent in it adds a condition to the where clause
            //values are pushed into the values array
            for(var [key, value] of Object.entries(params))
            {
                if(where_count > 0)
                {
                    where_clause = where_clause + " AND "
                }
                //user entry is a special case
                //this parameter must have a % LIKE wrapped around it
                if(key === 'user_entry')
                {
                    where_clause += " details LIKE ?"
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
                query = query + where_clause + order_clause
            }
            else
            {
                query = query + order_clause
            }
        }
        var result = [query, values]
        resolve(result)
    })
}