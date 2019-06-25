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
	response.send('view/davids.html')
})

app.get('/harshs', (request, response) => {
	response.status(200);
	response.send('view/harshs.html')
})

app.get('/tristans', (request, response) => {
	response.status(200);
	response.send('view/tristans.html')
})

app.get('/lidiyas', (request, response) => {
	response.status(200);
	response.send('view/lidiyas.html')
})

app.get('/sunnys', (request, response) => {
	response.status(200);
	response.send('view/sunnys')
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