const db = require('../auth/db_config.js')
var bcrypt = require('bcryptjs')

exports.register = function(data, callback) {
    bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: err
                });
            }
            else {
                var values = [ [6, data.username, data.email, data.password] ];
                
                db.query("INSERT INTO users (user_id, display_name, email, password) VALUES ?", [values], function (err, result, fields) {
                    if(err) {
                        console.log('error: ', err);
                    }
                    else {
                        console.log('successfully inserted user');  
                    }
                })
            }
        });
    });
}

exports.login = function(data, callback) {
    console.log(data.username)
}