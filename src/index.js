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

    // emit to all users eccept current socket
    socket.broadcast.emit('message', 'A current user has joined') 

    socket.on('sendMessage', message => {
        // emit to each clients
        io.emit('message', message) 
    })

    socket.on('sendLocation', coords => {
        io.emit('message', `https://google.com/maps?q=${coords.lattitude},${coords.longitude}`)
    })

    // disconnect is a built-in event in socket.io (so is connection)
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})