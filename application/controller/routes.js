const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
var path = require('path')

const db_categories = require('./categories.js')
const db_search = require('./search.js')
const db_locations = require('./locations.js')

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

router.get('/team', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/team.html'))
})

router.get('/about', (req, res) => {
    res.status(200)
    res.sendFile(path.resolve('view/about.html'))
})


module.exports = router