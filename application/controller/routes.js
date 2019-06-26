const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const router = express.Router()
var path = require('path')

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


module.exports = router