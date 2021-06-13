const socket = io()

// Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    // the name after elements is the name we give for the name attri. of input
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
    // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        error 
            ? console.log(error)
            : console.log('The message was delivered', message)
    })
})

$sendLocation.addEventListener('click', (e) => {
    !navigator.geolocation 
        ? alert('Geolocation is not supported on current browser')
        : navigator.geolocation.getCurrentPosition(position => {
            $sendLocation.setAttribute('disabled', 'disabled')
            socket.emit('sendLocation', { 
                lattitude:position.coords.latitude, 
                longitude: position.coords.longitude 
            }, () => {
                // client acknowledgement fn
                $sendLocation.removeAttribute('disabled')
            })
        })

})