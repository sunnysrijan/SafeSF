/*
Alex Wolski
Course: CSc 648 Software Engineering Summer 2019 Team 2

Handles the creation and verification of authentication tokens
*/

'use strict'
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

exports.createToken = function (data, callback) {
  var privateKey = fs.readFileSync(__dirname + path.normalize('/private.key'), 'utf8')

  var payload = {
    username: data.username,
    password: data.password,
    admin: data.admin
  }

  var tokenOptions = {
    issuer: 'SafeSF',
    subject: 'user',
    audience: 'http://ec2-34-220-99-220.us-west-2.compute.amazonaws.com/',
    algorithm: 'RS256'
  }

  if (data.remember === 'on') { tokenOptions.expiresIn = '10m' }

  jwt.sign(payload, privateKey, tokenOptions, function (err, token) {
    if (err) { callback(err, null) } else {
      console.log('Access token generated')
      callback(null, token)
    }
  })
}

exports.verifyToken = function (data, callback) {
  var publicKey = fs.readFileSync(__dirname + path.normalize('/public.key'), 'utf8')

  var tokenOptions = {
    issuer: 'SafeSF',
    subject: 'user',
    audience: 'http://ec2-34-220-99-220.us-west-2.compute.amazonaws.com/',
    algorithm: ['RS256']
  }

  jwt.verify(data, publicKey, tokenOptions, function (err, result) {
    if (err) { callback(err, null) } else { callback(null, result) }
  })
}
