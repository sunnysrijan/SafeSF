const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const dropdowns = require('./dropdowns.js')
const db_search = require('./search.js')
const image = require('./images.js')
const reports = require('./reports.js')
//const { body, check, validationResult } = require('express-validator')
const multer = require('multer')
const captcha = require('./captcha.js')
const formValidation = require('./form-validation.js')
const auth = require('../auth/auth.js')
const db=require('../auth/db_config')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
// Create the multer and limit the size of files to 2mb.
// var storage = multer.memoryStorage()

var storage = multer.diskStorage({
  destination : function (req, file, cb){
    cb(null, './view/report_images')
  },
  filename : function (req, file, cb){
    var file_name = new Date().getTime()
    cb(null, `${file_name}.jpg`)
  }

})
var upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }
})
//router.use(check())

/*
    Page requests
*/

router.get('/search-results', (req, res) => {
  res.status(200)
  res.sendFile(path.resolve('view/search-results.html'))
})

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

router.post('/admin', (req, res) => {
  db.query("Update reports set status='" + req.query.status + "' where report_id='" + req.query.reportID + "'", (error, results) => {
    if (error) {
      console.log(error)
      res.sendStatus(503)
    }
    res.sendstatus(200)
  })
})

/*
    Search
*/
router.get('/search', (req, res) => {
  if (req.query.admin ==='true'){
    console.log("In admin search")
    db.query("Select * from reports where status='unassigned'or status='assigned'", (error, results) => {
      if (error) {
        console.log(error)
        res.sendStatus(503)
      }
      res.status(200)
      res.send(results)

    })
  }
  else
  {
    db_search.getResults(req.query, function (err, result) {
    if (err) {
      console.log('Error retrieving search results: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved Search Results from the Database')
      res.status(200)
      res.send(result)
      }
    })
  }
})

/*
    Reports Endpoints
*/
// endpoint for POSTing reports
// Uses validator.js and express-validator.js libraries to enforce rules.
router.post('/submitReport', upload.single('file'), (req, res) => {
  console.log('POST endpoint.')
  // console.log('body: ', req.body)
  // console.log('file: ', req.file)

  // ---------- BEGIN FORM VALIDATION SECTION ----------
  if (!formValidation.validateReportSubmissionForm(req.body)) {
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
      // If we get here, then the token is valid.
      // Remove the captcha token from the original data packet.
      delete req.body['g-recaptcha-response']

      // ---------- BEGIN REPORT INSERTION SECTION ----------
      // Now that the validation is done, create the report.
      reports.createReport(req, function (err, result) {
        if (err) {
          console.log('Error creating report: ' + err)
          res.status(422)
          res.send('Error creating report\n')
          return
        } else {
          res.status(200)
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

router.get('/admin', (req, res) => {res.sendFile(path.join(__dirname, '../view/admin.html'));})

/*
    Dropdown endpoints
*/

// Endpoint for filling categories dropdown menu
router.get('/categories', (req, res) => {
  dropdowns.getCategories(function (err, result) {
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
  dropdowns.getLocations(function (err, result) {
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

// Endpoint for filling parks dropdown menu
router.get('/parks', (req, res) => {
  dropdowns.getParks(function (err, result) {
    if (err) {
      console.log('Error retrieving parks: ' + err)
      res.sendStatus(503)
    } else {
      console.log('Retrieved parks from the Database')
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
router.post('/requestRegister', upload.none(), (req, res) => {
  console.log('Registration endpoint.')
  console.log(req.body)

  // ---------- BEGIN FORM VALIDATION SECTION ----------
  if (!formValidation.validateRegistrationForm(req.body)) {
    res.status(422)
    res.send('Registration form validation failed!')
    console.log('Registration form validation failed!')
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

      // Convert the parameters to an object usable by our code.
      var authInfo = {
        username: req.body['username'],
        email: req.body['email'],
        password: req.body['password'],
      }

      // ---------- BEGIN USER DB INSERTION SECTION ----------
      // Now that the validation is done, create the report.
      auth.register(authInfo, function (err, token) {
        if (err) {
          console.log('Error registering: ', err.message)
          res.status(503)
          res.send(err.message)
          return
        } else {
          console.log(authInfo.username, 'succesfully registered')
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

router.get('/requestLogin', upload.none(), (req, res) => {
  // Convert the parameters to an object usable by our code.
  var authInfo = {}
  authInfo['username'] = req.query.username
  authInfo['password'] = req.query.password

  // ---------- BEGIN FORM VALIDATION SECTION ----------
  if (!formValidation.validateLoginForm(authInfo)) {
    res.status(422)
    res.send('Login form validation failed!')
    console.log('Login form validation failed!')
    return
  } else {
    auth.login(authInfo, function (err, token) {
      if (err) {
        console.log('Error logging in: ', err.message)
        res.status(503)
        res.send(err.message)
      } else {
        console.log(authInfo.username, 'succesfully logged in')
        res.cookie('accessToken', token)
        res.redirect('/')
        res.sendStatus(200)
        return
      }
    })
  }
  // ---------- END FORM VALIDATION SECTION ----------

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
