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

app.get('/sunny', (request, response) => {
	response.status(200);
	response.send('view/sunny.html')
})


http.listen(3000, () => {
	console.log("Server is up and listening on 3000...")
})

