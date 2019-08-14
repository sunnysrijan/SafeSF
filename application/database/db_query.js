
exports.buildSearchQuery = function (table, order, params) {
  var query = `
      SELECT DATE_FORMAT(reports.insert_date, '%d %M %Y %h:%i%p') AS insert_date,
        IF(reports.update_date IS NOT NULL, DATE_FORMAT(reports.update_date, '%d %M %Y %h:%i%p'), 'No updates yet.') AS update_date,
        reports.report_id, reports.status, reports.assigned_to, reports.category_id,
        reports.location_id, reports.image_ref, reports.loc_lat, reports.loc_long, reports.details,
        parks.loc_lat AS park_loc_lat, parks.loc_long AS park_loc_long, categories.category, locations.location FROM ${table}
      LEFT JOIN parks ON parks.park_id = reports.park_id
      LEFT JOIN categories ON categories.category_id = reports.category_id
      LEFT JOIN locations ON locations.location_id = reports.location_id`
  var where_clause = ' WHERE'
  var order_clause = ` ORDER BY ${order} DESC`
  var where_count = 0
  var values = []

  return new Promise(function (resolve, reject) {
    // checks if any parameters have been sent
    // if not it grabs the whole list
    if (params) {
      // for each parameter sent in it adds a condition to the where clause
      // values are pushed into the values array
      for (var [key, value] of Object.entries(params)) {
        if (where_count > 0) {
          where_clause = where_clause + ' AND '
        }
        // user entry is a special case
        // this parameter must have a % LIKE wrapped around it
        if (key === 'user_entry') {
          where_clause += ' details LIKE ?'
          where_count++
          value = '%' + value + '%'
          values.push(value)
        }
        else if (key === 'category_id' || key === 'location_id' || key === 'parks_id'){
          where_clause = where_clause + ' ' + 'reports.' + key + ' = ?'
          where_count++
          values.push(value)
        }
        else {
          where_clause = where_clause + ' ' + key + ' = ?'
          where_count++
          values.push(value)
        }
      }
      if (where_count > 0) {
        query = query + where_clause + order_clause
      } else {
        query = query + order_clause
      }
    }
    var result = [query, values]
    resolve(result)
  })
}
