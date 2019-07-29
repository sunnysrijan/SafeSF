const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const db_categories = require('./categories.js')
const db_search = require('./search.js')
const db_locations = require('./locations.js')
const image = require('./images.js')
const auth = require('../auth/auth.js')

router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())

router.get('/search', (req, res) => {
    db_search.getResults(req.query, function(err, result) {
        console.log(req.query)
        if(err) {
            console.log('Error retrieving search results: ' + err)
            res.sendStatus(503)
        }
        else {
            console.log("Retrieved Search Results from the Database")
            res.status(200)
            res.send(result)
        }
    })
})

router.get('/categories', (req, res) => {
    db_categories.getCategories(function(err, result) {
        if(err) {
            console.log('Error retrieving categories: ' + err)
            res.sendStatus(503)
        }
        else {
            console.log("Retrieved categories from the Database")
            res.status(200)
            res.send(result)
        }
    })
})

router.get('/locations', (req, res) => {
    db_locations.getLocations(function(err, result){
        if(err) {
            console.log('Error retrieving locations: ' + err)
            res.sendStatus(503)
        }
        else {
            console.log("Retrieved locations from the Database")
            res.status(200)
            res.send(result)
        }
    })
})

router.post('/images', (req, res) => {
    image.getImage(req.query, function(err, result){
        if(err) {
            console.log('Error retrieving image: ' + err)
            res.sendStatus(503)
        }
        else {
            console.log('Retrieved image from the Database')
            res.status(200)
            res.sendFile(path.resolve(result))
        }
    })
})

router.get('/register', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/register.html'))
})

router.get('/login', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/login.html'))
})

router.post('/requestRegister', (req, res) => {
	auth.register(req.query, function(err, token) {
        if(err) {
            console.log('Error registering: ', err.message)
            res.status(503)
            res.send(err.message)
        }
        else {
            console.log(req.query.username, 'succesfully registered')
            res.cookie('accessToken', token)
            res.sendStatus(200)
        }
	})
})

router.get('/requestLogin', (req, res) => {
	auth.login(req.query, function(err, token) {
        if(err) {
            console.log('Error logging in: ', err.message)
            res.status(503)
            res.send(err.message)
        }
        else {
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
    auth.authenticate(req.headers.cookie, function(err, result, token) {
        if(err) {
            console.log('Error verifying access. Deleting Cookie: ', err.message)
            res.clearCookie('accessToken')
            res.status(200)
            res.send(result)
        }
        else {
            console.log(result.username, ' authenticated: ', result.authenticated)

            if(token)
                res.cookie('accessToken', token, { overwrite: true })

            res.status(200)
            res.send(result)
        }
    })
})

router.get('/about', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/about.html'))
})

module.exports = router