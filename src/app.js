const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparse = require('body-parser')

app.use(morgan('dev'))
app.use(bodyparse.urlencoded({
    extended: false
}))
app.use(bodyparse.json())

app.get('/', (req, res) => {
    res.send('API - Viagens PMO')
})

module.exports = app