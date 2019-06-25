const express = require('express')
const app = express()
var http = require('http').createServer(app)
const path = require('path')
const router = express.Router()

app.use(express.static(__dirname + '/view'))
app.use('/', router)


app.get('/', (request, response) => {
	response.status(200);
	response.sendFile('view/index.html', {root: __dirname});
})

app.get('/davids', (request, response) => {
	response.status(200);
	response.sendFile('view/davids.html', {root : __dirname})
})

app.get('/harshs', (request, response) => {
	response.status(200);
	response.sendFile('view/harshs.html', {root: __dirname})
})

app.get('/tristans', (request, response) => {
	response.status(200);
	response.sendFile('view/tristans.html', {root : __dirname})
})


app.get('/lidiyas', (request, response) => {
	response.status(200);
	response.sendFile('view/lidiyas.html', {root : __dirname})
})

app.get('/sunnys', (request, response) => {
	response.status(200);
	response.sendFile('view/sunnys.html', {root : __dirname})
})

app.get('/alexs', (request, response) => {
	response.status(200);
	response.sendFile('/view/alexs.html', {root : __dirname})
})

app.get('/evans', (request, response) => {
	response.status(200);
	response.sendFile('/view/evans.html', {root : __dirname})
})

http.listen(3000, () => {
	console.log("Server is up and listening on 3000...")
})
