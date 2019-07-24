const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
var path = require('path')

const db_categories = require('./categories.js')
const db_search = require('./search.js')
const db_locations = require('./locations.js')
const image = require('./images.js')
const reports = require('./reports.js')

router.use(bodyParser.urlencoded({
    extended: false
}))
router.use(bodyParser.json())



router.get('/davids', (req, res) => {
    console.log("GET request made for /davids endpoint")
    res.status(200)
    res.sendFile(path.resolve('view/davids.html'))
})

router.get('/harshs', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/harshs.html'))
})

router.get('/tristans', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/tristans.html'))
})

router.get('/lidiyas', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/lidiyas.html'))
})

router.get('/sunnys', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/sunnys.html'))
})

router.get('/alexs', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/alexs.html'))
})

router.get('/evans', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/evans.html'))
})

router.get('/search', (req, res) => {
    db_search.getResults(req.query, function(err, result){
        console.log(req.query)
        if(err)
        {
            console.log('Error retrieving search results: ' + err)
            res.sendStatus(503)
        }
        else
        {
            console.log("Retrieved Search Results from the Database")
            res.status(200)
            res.send(result)
        }
    })
})

/*
    Reports Endpoints
*/

// endpoint for POSTing reports
router.post('/reports', (req, res) => {
    console.log("POST: reports endpoint")
    reports.createReport(req.query, function(err, result){
        console.log(res.query)
        if(err)
        {
            console.log('Error creating report: ' + err)
            res.status(503)
            res.send('Error creating report\n')
        }
        else
        {
            res.status(200)
            res.send(result)
        }
    })
})

router.get('/reports', (req, res) => {
    console.log("GET: reports endpoint")
    reports.getReport(req.query, function(err, result){
        console.log(res.query)
        if(err)
        {
            console.log('Error retrieving report: ' + err)
            res.status(503)
            res.send("Error retrieving report\n")
        }
        else
        {
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
    db_categories.getCategories(function(err, result){
        if(err)
        {
            console.log('Error retrieving search results: ' + err)
            res.sendStatus(503)
        }
        else
        {
            console.log("Retrieved Search Results from the Database")
            res.status(200)
            res.send(result)
        }
    })
})
// Endpoint for filling locations dropdown menu
router.get('/locations', (req, res) => {
    db_locations.getLocations(function(err, result){
        if(err)
        {
            console.log('Error retrieving search results: ' + err)
            res.sendStatus(503)
        }
        else
        {
            console.log("Retrieved Search Results from the Database")
            res.status(200)
            res.send(result)
        }
    })
})

/*
    TODO: currently unassigned endpoints. need to be assigned
*/
router.get('/images', (req, res) => {
    image.getImage(req.query, function(err, result){
        if(err)
        {
            console.log('Error retrieving picture: ' + err)
            res.sendStatus(503)
        }
        else
        {
            console.log('Succesfully retrieved image')
            res.status(200)
            res.sendFile(path.resolve(result))
        }
    })
})

router.get('/team', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/team.html'))
})

router.get('/about', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/about.html'))
})


module.exports = router