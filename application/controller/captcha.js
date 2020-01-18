/*
Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2

Verifies if the captcha was completed correctly
*/

var request = require('request')

exports.getCaptchaValidationStatus = function (params, callback) {
  // The token string.
  var captchaToken = params['g-recaptcha-response']
  var userIPAdress = params['remote-address']

  // reCAPTCHA secret/server key.
  var secretKey = '6LfbkLEUAAAAAJjFA-c-wylbzVsjgc4Q4lL29gCN'
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl =
      'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey +
      '&response=' + captchaToken + '&remoteip=' + userIPAdress

  // Send verification request to Google. Response will be true/false for
  // pass/fail respectively.
  request(verificationUrl, function (error, response, body) {
    body = JSON.parse(body)
    if (body.success !== undefined && !body.success) {
      // If the response we get is telling us that there is an error, notify the user.
      callback(new Error(error), null)
    }
    console.log('Captacha token valid!')
    var result = { valid: true }

    callback(null, result)
    // If we get past the above if statement then the token is valid and the
    // report will post.
  })
}
