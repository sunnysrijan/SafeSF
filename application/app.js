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

app.get('/member4', (request, response) => {
	response.status(200);
	response.send('group member 4')
})

app.get('/member5', (request, response) => {
	response.status(200);
	response.send('group member 5')
})

app.get('/member6', (request, response) => {
	response.status(200);
	response.sendFile('/view/tristan.html', {root : __dirname})
})

app.get('/member7', (request, response) => {
	response.status(200);
	response.sendFile('/view/davids.html', {root : __dirname})
})

http.listen(3000, () => {
	console.log("Server is up and listening on 3000...")
})

