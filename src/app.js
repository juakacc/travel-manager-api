const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparse = require('body-parser')

const veiculoRotas = require('./controller/veiculos')

app.use(morgan('dev'))
app.use(bodyparse.urlencoded({
    extended: false
}))
app.use(bodyparse.json())

app.get('/', (req, res) => {
    res.send('API - Viagens PMO')
})

app.use('/veiculos', veiculoRotas)

module.exports = app