'use strict';
const path = require('path');
const fs   = require('fs');
const jwt  = require('jsonwebtoken');

exports.createToken = function(data, callback) {
	var privateKey  = fs.readFileSync(__dirname + path.normalize('/private.key'), 'utf8');

	var payload = {
		password: data.password
	};

	var signOptions = {
		issuer:  'SafeSF',
		subject:  data.username,
		audience:  'http://ec2-34-220-99-220.us-west-2.compute.amazonaws.com/',
		expiresIn:  '12h',
		algorithm:  'RS256'
	};

	var token = jwt.sign(payload, privateKey, signOptions);
	console.log('token: ', token)
	
	return token
}

exports.verifyToken = function(data, callback) {
	var publicKey  = fs.readFileSync('./public.key', 'utf8');
}