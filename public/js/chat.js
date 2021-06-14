const socket = io()

// Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options
// Browser does not support requirejs so the algorithm must be placed here
const getQueryProperties = (query) => {
    if (query) {
        const keyValuePairs = {}
        let queryString = query.substring(1)
        let pairs = queryString.split('&')
        for ( let i = 0; i < pairs.length; i++ ) {
            let pair = pairs[i].split('=')
            let key = decodeURIComponent(pair[0])
            let value = decodeURIComponent(pair[1])
            keyValuePairs[key] = value
        }
        return keyValuePairs
    }
}
const { username, room } = getQueryProperties(location.search)

socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('YYYY-MMM-DD HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('YYYY-MMM-DD HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
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

$sendLocation.addEventListener('click', () => {
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


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = './'
    }
})






