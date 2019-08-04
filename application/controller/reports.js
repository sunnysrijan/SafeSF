const db = require("../auth/db_config.js")

exports.createReport = function(params, callback){

    var insert_table = 'reports'

    var field_placeholders = " ("
    var value_placeholders = " VALUES("

    var insert_query = `INSERT INTO ${insert_table}`
    console.log(params)
    var fields = []
    var values = []
    var placeholder_replacement = []

    if(params)
    {
        params["report_id"] = new Date().getTime()
        params["park_id"] = 1 // this is for testing purposes
        params["user_id"] = '52a885e0-ae55-11e9-bcaf-9fea80b280db'

        for(var [field, value] of Object.entries(params))
        {
            if(field == 'image_ref' || field == 'remember')
            {
               continue
            }
            else{
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
    var select_query = `
      SELECT reports.*, parks.loc_lat AS park_loc_lat, parks.loc_long AS park_loc_long, categories.category, locations.location FROM ${select_table}
      LEFT JOIN parks ON parks.park_id = reports.park_id
      LEFT JOIN categories ON categories.category_id = reports.category_id
      LEFT JOIN locations ON locations.location_id = reports.location_id
      WHERE report_id = ?`

    db.query(select_query, params["report_id"], function(err, result){

        if(err) {
            console.log("Error querying database : " + err)
            console.log(select_query)
            console.log(params["report_id"])
            callback(err, null)
        }
        else{
            console.log("Report successfully retrieved")
            console.log(result)
            callback(null, result)
        }
    } )
}
