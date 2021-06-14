const path = require('path')
const http = require('http') 
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
    

    socket.on('join', ({username, room }) => {
        // socket.join: can only be used on server, emit events to specific room
        socket.join(room)  

        // socket.emit: emit to current user
        socket.emit('message', generateMessage('Welcome!'))

        // // socket.broadcast: emit to all users eccept current socket
        // socket.broadcast.emit('message', 'A current user has joined')

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`)) 

    })

    

    socket.on('sendMessage', (message, callback) => {
        const filter =new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // io.emit: emit to each clients, since io() is called on client-side
        io.emit('message', generateMessage(message))
        callback() 
    })

    socket.on('sendLocation', (coords, callback) => {
        const url = `https://google.com/maps?q=${coords.lattitude},${coords.longitude}`
        socket.emit('locationMessage', generateLocationMessage(url))
        callback()
    })

    // 'disconnect': a built-in event in socket.io (so is connection)
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})