const path = require('path')
const http = require('http') 
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
    

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        // socket.join: can only be used on server, emit events to the specific room
        socket.join(user.room)  

        // socket.emit: emit to current user
        socket.emit('message', generateMessage('ChatAppBot', 'Welcome!'))

        // socket.broadcast.to: emit to all users in the specific room eccept the current socket
        socket.broadcast.to(user.room).emit('message', generateMessage('ChatAppBot', `${user.username} has joined!`))

        callback() // Without any arguments => w.o. any errors
    })

    

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter =new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // io.emit: emit to each clients, since io() is called on client-side
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback() 
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        const url = `https://google.com/maps?q=${coords.lattitude},${coords.longitude}`

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))
        callback()
    })

    // 'disconnect': a built-in event in socket.io (so is connection)
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('ChatAppBot', `${user.username} has left`))
        }
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})