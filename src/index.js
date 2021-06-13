const path = require('path')
const http = require('http') 
const express = require('express')
const socketio = require('socket.io')
// const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
    socket.emit('message', 'Welcome')

    socket.on('sendMessage', message => {
        io.emit('message', message)
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})