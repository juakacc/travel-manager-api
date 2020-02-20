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

router.get('/disponiveis', (req, res, next) => {
    Veiculo.findAll({
        where: { disponivel: true }        
    })
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

router.get('/:veiculoId', (req, res, next) => {
    const id = req.params.veiculoId

    Veiculo.findByPk(id)
    .then(veiculo => {
        if (veiculo == null) {
            res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Veiculo não encontrado'
            })
        }
        res.status(HttpStatus.OK).json(veiculo)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
})

router.post('/', (req, res, next) => {
    Veiculo.create(req.body)
    .then(veiculo => {
        res.status(HttpStatus.CREATED).json(veiculo.dataValues)
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

router.delete('/:veiculoId', (req, res, next) => {
    const id = req.params.veiculoId

    Veiculo.destroy({
        where: { id }
    })
    .then(() => {
        res.status(HttpStatus.NO_CONTENT).send()
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

module.exports = router