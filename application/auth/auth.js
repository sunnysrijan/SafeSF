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
                        var tokenData = { 'username': data.username, 'password': data.password }

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

exports.authenticate = function(cookie, callback) {
    if(cookie == null)
        callback(null, false)
    else {
        var token = exports.parseCookie(cookie)

        if(token == null)
            callback(null, false)
        else {
            jwt.verifyToken(token, function(err, decodedToken) {
                console.log('Authenticating ', decodedToken.username)

                if(err)
                    callback(err, null)
                else
                {
                    db.query("SELECT * FROM users WHERE display_name = ?", decodedToken.username, function (err, result, fields) {
                        if(!result || !result.length)
                            callback(new Error('Can\'t authenticate user. Username does not exist.'), null)
                        else {
                            bcrypt.compare(decodedToken.password, result[0].password, function(err, res) {
                                if(res)
                                    callback(null, true)
                                else
                                    callback(new Error('Can\'t authenticate user. Password is incorrect.'), null)
                            })
                        }
                    })
                }
            })
        }
    }
}

exports.parseCookie = function(cookie) {
    var startIndex = cookie.indexOf('accessToken') + 12

    if(startIndex === -1)
        return null

    var endIndex = startIndex

    for(; endIndex < cookie.length; endIndex++)
        if(cookie.charAt(endIndex) === ';')
            break

    return cookie.substring(startIndex, endIndex)
}