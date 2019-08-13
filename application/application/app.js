
const express = require('express')
const app = express()
var http = require('http').createServer(app)
const path = require('path')
const router = require('./controller/routes.js')

app.use(express.static(__dirname + '/view'))
app.use(router)

app.get('/', function (request, response) {
  console.log('GET request made for the root /')
  response.status(200)
  response.sendFile('view/index.html', { root: __dirname })
})

http.listen(3000, function () {
  console.log('Server is up and listening on 3000...')
})
