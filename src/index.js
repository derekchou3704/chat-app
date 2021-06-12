const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT


// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})