const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparse = require('body-parser')

const veiculoRotas = require('./controller/veiculos')
const motoristaRotas = require('./controller/motoristas')
const viagensRotas = require('./controller/viagens')

app.use(morgan('dev'))
app.use(bodyparse.urlencoded({
    extended: false
}))
app.use(bodyparse.json())

app.get('/', (req, res) => {
    res.send('API - Viagens PMO')
})

app.use('/veiculos', veiculoRotas)
app.use('/motoristas', motoristaRotas)
app.use('/viagens', viagensRotas)

module.exports = app