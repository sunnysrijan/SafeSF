const db = require('../auth/db_config.js')
const sharp = require('sharp')

exports.createReport = function (request, callback) {
  1234
  var params = request.body
  //var image = request.file.filename

  var insert_table = 'reports'
  var field_placeholders = ' ('
  var value_placeholders = ' VALUES('
  var insert_query = `INSERT INTO ${insert_table}`

  //var report_id = image.split('.')[0]\
  report_id = Math.random()



  var fields = []
  var values = []
  var placeholder_replacement = []

  if (params) {
    params['report_id'] = report_id
    params['user_id'] = '52a885e0-ae55-11e9-bcaf-9fea80b280db'

    for (var [field, value] of Object.entries(params)) {
      if (field === 'image_ref' || field === 'remember') {
        continue
      } else {
        fields.push(field)
        values.push(value)
        field_placeholders += '??,'
        value_placeholders += '?,'
      }
    }

    field_placeholders = field_placeholders.substring(0, field_placeholders.length - 1)
    value_placeholders = value_placeholders.substring(0, value_placeholders.length - 1)

    field_placeholders += ')'
    value_placeholders += ')'
    insert_query = insert_query + field_placeholders + value_placeholders
  }
  placeholder_replacement = fields.concat(values)

 
  // sharp(`./view/report_images/${image}`).resize(200,200).toFile(`./view/report_images/${params["report_id"]}-thumb.jpg`, function(err){
  //   if(err){

  //     console.log("Error thumbnailing image: " + err)
  //   }
  //   else{
  //     console.log("Image thumbnailed")
  //   }
  // })


  db.query(insert_query, placeholder_replacement, function (err, result) {
    if (err) {
      console.log('Error querying database : ' + err)
      console.log(insert_query)
      console.log(placeholder_replacement)
      callback(err, null)
    } else {

      console.log('Results succesfully retrieved')
      result.report_id = params['report_id']
      callback(null, result)
    }
  })
}

exports.getReport = function (params, callback) {
  var select_table = 'reports'
  var select_query = `
      SELECT reports.report_id, DATE_FORMAT(reports.insert_date, '%d %M %Y %h:%i%p') AS insert_date,
        IF(reports.update_date IS NOT NULL, DATE_FORMAT(reports.update_date, '%d %M %Y %h:%i%p'), 'No updates yet.') AS update_date,
        reports.status, reports.assigned_to, reports.image_ref,
        reports.loc_lat, reports.loc_long, reports.details,
        parks.loc_lat AS park_loc_lat, parks.loc_long AS park_loc_long, categories.category, locations.location FROM ${select_table}
      LEFT JOIN parks ON parks.park_id = reports.park_id
      LEFT JOIN categories ON categories.category_id = reports.category_id
      LEFT JOIN locations ON locations.location_id = reports.location_id
      WHERE report_id = ?`

  db.query(select_query, params['report_id'], function (err, result) {
    if (err) {
      console.log('Error querying database : ' + err)
      console.log(select_query)
      console.log(params['report_id'])
      callback(err, null)
    } else {
      console.log('Report successfully retrieved')
      console.log('update date: ', result[0].update_date)
      callback(null, result)
    }
  })
}
