const express = require('express')
const app = express()
var http = require('http').createServer(app)
const path = require('path')
const router = express.Router()

app.use(express.static(__dirname + '/view'))
app.use('/', router)


app.get('/', (request, response) => {
	response.send('test')
})

app.get('/member1', (request, response) => {
	response.send('group member 1')
})

app.get('/member2', (request, response) => {
	response.send('group member 2')
})

app.get('/member3', (request, response) => {
	response.send('group member 3')
})

app.get('/member4', (request, response) => {
	response.send('group member 4')
})

app.get('/member5', (request, response) => {
	response.send('group member 5')
})

app.get('/member6', (request, response) => {
	response.send('group member 6')
})

app.get('/member7', (request, response) => {
	response.sendFile('/view/davids.html', {root : __dirname})
})

http.listen(3000, () => {
	console.log("Server is up and listening on 3000...")
})

