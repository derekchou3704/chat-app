const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    // the name after elements is the name we give for the name attri. of input
    
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        error 
            ? console.log(error)
            : console.log('The message was delivered', message)
    })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    !navigator.geolocation 
        ? alert('Geolocation is not supported on current browser')
        : navigator.geolocation.getCurrentPosition(position => {
            socket.emit('sendLocation', { 
                lattitude:position.coords.latitude, 
                longitude: position.coords.longitude 
            }, (error) => {
                // client acknowledgement fn
                error 
                    ? console.log(error)
                    : console.log('Location was delivered')
            })
        })

})