const db = require("../auth/db_config.js")

exports.createReport = function(params, callback){

    var insert_table = 'reports'

    var field_placeholders = " ("
    var value_placeholders = " VALUES("

    var insert_query = `INSERT INTO ${insert_table}`

    var fields = []
    var values = []
    var placeholder_replacement = []

    if(params)
    {
        params["report_id"] = new Date().getTime()

        for(var [field, value] of Object.entries(params))
        {
            if(field != 'image_ref')
            {
                fields.push(field)
                values.push(value)
                field_placeholders += "??,"
                value_placeholders += "?,"
            }
        
        }

        field_placeholders = field_placeholders.substring(0, field_placeholders.length - 1)
        value_placeholders = value_placeholders.substring(0, value_placeholders.length - 1)

        field_placeholders += ')'
        value_placeholders += ')'
        insert_query = insert_query + field_placeholders + value_placeholders
    }
    placeholder_replacement = fields.concat(values)

    db.query(insert_query, placeholder_replacement, function(err, result){
        
        if(err) {
            console.log("Error querying database : " + err)
            console.log(insert_query)
            console.log(placeholder_replacement)
            callback(err, null)
        }
        else {
            console.log("Results succesfully retrieved")
            result.report_id = params["report_id"]
            callback(null, result)
        }

    })
}

exports.getReport = function(params, callback) {

    var select_table = "reports"
    var select_query = `SELECT * from ${select_table} WHERE report_id = ?`

    db.query(select_query, params["report_id"], function(err, result){

        if(err) {
            console.log("Error querying database : " + err)
            console.log(select_query)
            console.log(params["report_id"])
            callback(err, null)
        }
        else{
            console.log("Report successfully retrieved")
            callback(null, result)
        }
    } )
}