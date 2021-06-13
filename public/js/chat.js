const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    // the name after elements is the name we give for the name attri. of input
    console.log(e.target.elements.message)
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})