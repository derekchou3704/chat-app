const path = require('path')
const http = require('http') 
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
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
    socket.emit('message', generateMessage('Welcome!'))

    // emit to all users eccept current socket
    socket.broadcast.emit('message', 'A current user has joined') 

    socket.on('sendMessage', (message, callback) => {
        const filter =new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // emit to each clients
        io.emit('message', generateMessage(message))
        callback() 
    })

    socket.on('sendLocation', (coords, callback) => {
        const url = `https://google.com/maps?q=${coords.lattitude},${coords.longitude}`
        socket.emit('locationMessage', generateLocationMessage(url))
        callback()
    })

    // disconnect is a built-in event in socket.io (so is connection)
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})