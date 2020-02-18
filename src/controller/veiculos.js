const express = require('express')
const Veiculo = require('../model/Veiculo')
const HttpStatus = require('http-status-codes')

const router = express.Router()

router.get('/', (req, res, next) => {
    Veiculo.findAll()
    .then(veiculos => {
        res.status(HttpStatus.OK).json(veiculos)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
})

module.exports = router