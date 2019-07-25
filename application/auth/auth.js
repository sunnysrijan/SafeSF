const db = require('../auth/db_config.js')
const uuid = require('uuid/v1');
var bcrypt = require('bcryptjs')

exports.register = function(data, callback) {
    bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            if (err) {
                return callback(err);
            }
            else {
                var values = [ [uuid(), data.username, data.email, hash] ]
                
                db.query("INSERT INTO users (user_id, display_name, email, password) VALUES ?", [values], function (err, result, fields) {
                    if(err)
                        return callback(err);
                    else
                        return callback(null);
                })
            }
        })
    })
}

exports.login = function(data, callback) {
    db.query("SELECT * FROM users WHERE display_name = ?", data.username, function (err, result, fields) {
        if(!result)
            callback(new Error('That usename is not registered'))
        else
        {
            bcrypt.compare(data.password, result[0].password, function(err, res) {
                console.log(res)

                if(res)
                    return callback(null)
                else
                    return callback(new Error('That password is incorrect'))
            })
        }
    })
}