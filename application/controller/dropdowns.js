const db = require('../auth/db_config.js')

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
  return new Promise(function (resolve, reject) {
    var result = db.query('SELECT COUNT(*) AS numLocations FROM locations', function (err, result) {
      if (err) {
        reject(new Error('locations table error!'))
      } else {
        resolve(result[0].numLocations)
      }
    })
  })
}

exports.getCategories = function (callback) {
  db.query('SELECT * FROM categories', function (err, result) {
    if (err) {
      console.log('Error querying database : ' + err)
      callback(err, null)
    } else {
      console.log('Results succesfully retrieved')
      callback(null, result)
    }
  })
}

// Queries the DB and gets the number of categories in the database.
exports.getNumberOfCategories = function () {
  return new Promise(function (resolve, reject) {
    var result = db.query('SELECT COUNT(*) AS numCategories FROM categories', function (err, result) {
      if (err) {
        reject(new Error('categories table error!'))
      } else {
        resolve(result[0].numCategories)
      }
    })
  })
}

exports.getParks = function (callback) {
  db.query('SELECT * FROM parks', function (err, result) {
    if (err) {
      console.log('Error querying database : ' + err)
      callback(err, null)
    } else {
      console.log('Results succesfully retrieved')
      callback(null, result)
    }
  })
}

// Queries the DB and gets the number of parks in the database.
exports.getNumberOfParks = function () {
  return new Promise(function (resolve, reject) {
    var result = db.query('SELECT COUNT(*) AS numCategories FROM parks', function (err, result) {
      if (err) {
        reject(new Error('parks table error!'))
      } else {
        resolve(result[0].numCategories)
      }
    })
  })
}