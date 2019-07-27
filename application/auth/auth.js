const db = require('./db_config.js')
const jwt = require('./jwt.js')
const uuid = require('uuid/v1')
var bcrypt = require('bcryptjs')
var cookie = require('cookie');

exports.register = function(data, callback) {
    bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            if (err) {
                console.log('Error: ', err)
                callback(new Error('Oops! There was an error! Please contact a system administrator.'), null)
            }
            else {
                var values = [ [uuid(), data.username, data.email, hash] ]
                
                db.query("INSERT INTO users (user_id, display_name, email, password) VALUES ?", [values], function (err, result, fields) {
                    if(err){
		                var errorMessage = err.toString();

		            	if(errorMessage.includes("Duplicate entry"))
		            	{
		            		if(errorMessage.includes("display_name"))
		                		callback(new Error('That username is already taken. Please chooose another one.'), null)
		                	else if(errorMessage.includes("email"))
		                		callback(new Error('That email is already registered. Please use another one.'), null)
		            	}
                    }
                    else
                    {
                        var tokenData = { 'username': data.username, 'password': data.password, 'remember': true }

                        jwt.createToken(tokenData, function(err, token) {
                            if(err) {
                                console.log('Error: ', err)
                                callback(new Error('Oops! There was an error! Please contact a system administrator.'), null)
                            }
                            else
                                callback(null, token)
                        })
                    }
                })
            }
        })
    })
}

exports.login = function(data, callback) {
    db.query("SELECT * FROM users WHERE display_name = ?", data.username, function (err, result, fields) {
        if(!result || !result.length)
            callback(new Error('That usename is not registered'), null)
        else {
            bcrypt.compare(data.password, result[0].password, function(err, res) {
                if(res) {
                    jwt.createToken(data, function(err, token) {
                        if(err) {
                            console.log('Error: ', err)
                            callback(new Error('Oops! There was an error! Please contact a system administrator.'), null)
                        }
                        else
                            callback(null, token)
                    })
                }
                else
                    callback(new Error('That password is incorrect'), null)
            })
        }
    })
}

exports.authenticate = function(cookieList, callback) {
    if(cookieList == null)
        callback(new Error('Can\'t authenticate user. No cookies.'), {"authenticated": false, "username": null})
    else {
        var token = exports.parseCookie(cookieList)

        if(token == null)
            callback(new Error('Can\'t authenticate user. No access token cookie.'), {"authenticated": false, "username": null})
        else {
            jwt.verifyToken(token, function(err, decodedToken) {
                if(err)
                {
                    if(err.message === 'jwt expired')
                        callback(err, {"authenticated": false, "username": null, "errMessage": "Your session has expired. Please log in again."})
                    else
                        callback(err, {"authenticated": false, "username": null})
                }
                else
                {
                    db.query("SELECT * FROM users WHERE display_name = ?", decodedToken.username, function (err, result, fields) {
                        if(!result || !result.length)
                            callback(new Error('Can\'t authenticate user. Username does not exist.'), {"authenticated": false, "username": null})
                        else {
                            bcrypt.compare(decodedToken.password, result[0].password, function(err, res) {
                                if(res)
                                    callback(null, {"authenticated": true, "username": decodedToken.username})
                                else
                                    callback(new Error('Can\'t authenticate user. Password is incorrect.'), {"authenticated": false, "username": null})
                            })
                        }
                    })
                }
            })
        }
    }
}

exports.parseCookie = function(cookieList) {
    var cookieArray = cookieList.split(';');

    for(var i = 0; i < cookieArray.length; i++)
        if(cookieArray[i].startsWith('accessToken='))
            return cookieArray[i].substring(12, cookieArray[i].length)
}