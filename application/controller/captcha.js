const db = require('../auth/db_config.js')
var request = require('request')

exports.getCaptchaValidationStatus = function (params, callback) {
  // The bool determining whether or not the token is valid.
  var tokenValid = false
  // The token string.
  var captchaToken = params['g-recaptcha-response']
  var userIPAdress = params['remote-address']
  console.log('Captcha token: ' + captchaToken)

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
    if (body.success != undefined && !body.success) {
      // If the response we get is telling us that there is an error, set
      // variables and notify the user without inserting the report into the
      // database.
      var err = { status: 401, message: 'Captcha invalid.', valid: false }
      callback(err, null)
    }
    console.log('Captacha token valid!')
    var result = { valid: true }

    callback(null, result)
    // If we get past the above if statement then the token is valid and the
    // report will post.
  })
}
