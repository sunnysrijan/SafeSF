const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const db_categories = require('./categories.js')
const db_search = require('./search.js')
const db_locations = require('./locations.js')
const image = require('./images.js')
const reports = require('./reports.js')
const { body, check, validationResult } = require('express-validator')
const captcha = require('./captcha.js')
const formValidation = require('./form-validation.js')
const auth = require('../auth/auth.js')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(check())

/*
    Page requests
*/
router.get('/register', (req, res) => {
  res.status(200)
  res.sendFile(path.resolve('view/register.html'))
})

router.get('/login', (req, res) => {
  res.status(200)
  res.sendFile(path.resolve('view/login.html'))
})

router.get('/report', (req, res) => {
  res.status(200)
  res.sendFile(path.resolve('view/report.html'))
})

router.get('/submitReport', (req, res) => {
  res.status(200)
  res.sendFile(path.resolve('view/report-submission.html'))
})

/*
    Search
*/
router.get('/search', (req, res) => {
  db_search.getResults(req.query, function (err, result) {
    console.log(req.query)
    if (err) {
      console.log('Error retrieving search results: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved Search Results from the Database')
      res.status(200)
      res.send(result)
    }
  })
})

/*
    Reports Endpoints
*/
// endpoint for POSTing reports
// Uses validator.js and express-validator.js libraries to enforce rules.
router.post('/submitReport', [
  body('g-recaptcha-response').exists({ checkNull: true, checkFalsy: true }).withMessage('No captcha token sent!'),
  body('category_id')
    .exists({ checkNull: true }),
  body('location_id')
    .exists({ checkNull: true }),
  body('details')
    .exists({ checkNull: true }),
  body('loc_lat')
    .exists({ checkNull: true }),
  body('loc_long')
    .exists({ checkNull: true }),
  body('user_id')
    .exists({ checkNull: true }),
  body('image_ref')
    .exists({ checkNull: true })
], (req, res) => {
  console.log('POST endpoint.')
  console.log(req.body)

  // Check for errors from express-validator checks above.
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Error: ', errors)
    res.status(422)
    res.send(errors)
    console.log('g-recaptcha-response: ' + body['g-recaptcha-response'] + ' - fail')
    return
  } else {
    console.log('g-recaptcha-response: ' + body['g-recaptcha-response'] + ' - pass')
  }

  // ---------- BEGIN FORM VALIDATION SECTION ----------
  if (!formValidation.validateSubmissionForm(req.body)) {
    res.status(422)
    res.send('Report form validation failed!')
    console.log('Report form validation failed!')
    return
  }
  // ---------- END FORM VALIDATION SECTION ----------

  // ---------- BEGIN CAPTCHA VALIDATION SECTION ----------
  // g-recaptcha-response is the token that is generated when the user succeeds
  // in a captcha challenge.
  var params = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }
  // Start the verification process.
  captcha.getCaptchaValidationStatus(params, function (err, result) {
    // If the verification process failed, tell the user and do not enter
    // report data into DB.
    if (err) {
      console.log('Captcha invalid, value: ', err)
      res.status(422)
      res.send(err)
      return
    } else {
      console.log(result)
      // If we get here, then the token is valid.
      // Remove the captcha token from the original data packet.
      delete req.body['g-recaptcha-response']

      // ---------- BEGIN REPORT INSERTION SECTION ----------
      // Now that the validation is done, create the report.
      reports.createReport(req.body, function (err, result) {
        if (err) {
          console.log('Error creating report: ' + err)
          res.status(422)
          res.send('Error creating report\n')
          return
        } else {
          res.status(200)
          console.log(result)
          res.redirect('report?report_id=' + result.report_id)
          return
        }
      })
      // ---------- END REPORT INSERTION SECTION ----------
    }
  })
  // ---------- END CAPTCHA VALIDATION SECTION ----------
})

// Gets data of a report for the full-page report page.
router.get('/getReport', (req, res) => {
  console.log('GET: reports endpoint')
  reports.getReport(req.query, function (err, result) {
    console.log(res.query)
    if (err) {
      console.log('Error retrieving report: ' + err)
      res.status(503)
      res.send('Error retrieving report\n')
    } else {
      res.status(200)
      res.send(result)
    }
  })
})

/*
    Dropdown endpoints
*/

// Endpoint for filling categories dropdown menu
router.get('/categories', (req, res) => {
  db_categories.getCategories(function (err, result) {
    if (err) {
      console.log('Error retrieving categories: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved categories from the Database')
      res.status(200)
      res.send(result)
    }
  })
})

// Endpoint for filling locations dropdown menu
router.get('/locations', (req, res) => {
  db_locations.getLocations(function (err, result) {
    if (err) {
      console.log('Error retrieving locations: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved locations from the Database')
      res.status(200)
      res.send(result)
    }
  })
})

/*
    TODO: currently unassigned endpoints. need to be assigned
*/
router.get('/images', (req, res) => {
  image.getImage(req.query, function (err, result) {
    if (err) {
      console.log('Error retrieving image: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved image from the Database')
      res.status(200)
      res.sendFile(path.resolve(result))
    }
  })
})

// endpoint for POSTing (creating) new users
// Uses validator.js and express-validator.js libraries to enforce rules.
router.post('/requestRegister', [
  body('g-recaptcha-response').exists({ checkNull: true, checkFalsy: true }).withMessage('No captcha token sent!'),
  body('display_name')
    .exists({ checkNull: true }),
  body('email')
    .exists({ checkNull: true }),
  body('password')
    .exists({ checkNull: true }),
  body('passwordConfirmation')
    .exists({ checkNull: true })
], (req, res) => {
  console.log('Registration endpoint.')
  console.log(req.body)

  // ---------- BEGIN CAPTCHA VALIDATION SECTION ----------
  // g-recaptcha-response is the token that is generated when the user succeeds
  // in a captcha challenge.
  var params = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }
  // Start the verification process.
  captcha.getCaptchaValidationStatus(params, function (err, result) {
    // If the verification process failed, tell the user and do not enter
    // report data into DB.
    if (err) {
      console.log('Captcha invalid, value: ', err)
      res.status(422)
      res.send(err)
      return
    } else {
      console.log(result)
      // If we get here, then the token is valid.
      // Remove the captcha token from the original data packet.
      delete req.body['g-recaptcha-response']

      // ---------- BEGIN USER DB INSERTION SECTION ----------
      // Now that the validation is done, create the report.
      auth.register(req.query, function (err, token) {
        if (err) {
          console.log('Error registering: ', err.message)
          res.status(503)
          res.send(err.message)
          return
        } else {
          console.log(req.query.username, 'succesfully registered')
          res.cookie('accessToken', token)
          res.sendStatus(200)
          return
        }
      })
      // ---------- END USER DB INSERTION SECTION ----------
    }
  })
  // ---------- END CAPTCHA VALIDATION SECTION ----------
})

router.get('/requestLogin', (req, res) => {
  auth.login(req.query, function (err, token) {
    if (err) {
      console.log('Error logging in: ', err.message)
      res.status(503)
      res.send(err.message)
    } else {
      console.log(req.query.username, 'succesfully logged in')
      res.cookie('accessToken', token)
      res.sendStatus(200)
    }
  })
})

router.get('/requestLogout', (req, res) => {
  console.log('User logged out')
  res.clearCookie('accessToken')
  res.sendStatus(200)
})

router.get('/requestAccess', (req, res) => {
  auth.authenticate(req.headers.cookie, function (err, result, token) {
    if (err) {
      console.log('Error verifying access. Deleting Cookie: ', err.message)
      res.clearCookie('accessToken')
      res.status(200)
      res.send(result)
    } else {
      console.log(result.username, ' authenticated: ', result.authenticated)

      if (token) { res.cookie('accessToken', token, { overwrite: true }) }

      res.status(200)
      res.send(result)
    }
  })
})

module.exports = router
