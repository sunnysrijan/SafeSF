const db = require('../auth/db_config.js')
const uuid = require('uuid/v1');
var bcrypt = require('bcryptjs')

exports.register = function(data, callback) {
    bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            if (err) {
                return callback(new Error('Oops! There was an error! Please contact a system administrator.'));
            }
            else {
                var values = [ [uuid(), data.username, data.email, hash] ]
                
                db.query("INSERT INTO users (user_id, display_name, email, password) VALUES ?", [values], function (err, result, fields) {
                    if(err){
		                var errorMessage = err.toString();

		            	if(errorMessage.includes("Duplicate entry"))
		            	{
		            		if(errorMessage.includes("display_name"))
		                		return callback(new Error('That username is already taken. Please chooose another one.'));
		                	else if(errorMessage.includes("email"))
		                		return callback(new Error('That email is already registered. Please use another one.'));
		            	}
                    }
                    else
                        return callback(null);
                })
            }
        })
    })
}

exports.login = function(data, callback) {
    db.query("SELECT * FROM users WHERE display_name = ?", data.username, function (err, result, fields) {
        if(!result || !result.length)
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