const express = require('express')
const Veiculo = require('../models').veiculo
const HttpStatus = require('http-status-codes')
const check_auth = require('../middleware/check_auth')

const router = express.Router()

router.get('/', check_auth, (req, res, next) => {
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

router.get('/disponiveis', check_auth, (req, res, next) => {
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

router.get('/:veiculoId', check_auth, (req, res, next) => {
    const id = req.params.veiculoId

    Veiculo.findByPk(id)
    .then(veiculo => {
        if (veiculo == null) {
            return res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Veiculo não encontrado'
            })
        } else {
            return res.status(HttpStatus.OK).json(veiculo.dataValues)
        }        
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
})

router.post('/', check_auth, (req, res, next) => {

    const { nome, placa, renavam, marca, modelo, cnh_requerida } = req.body

    if ('' === nome.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Nome inválido'
        })
    }

    if ('' === placa.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Placa inválida'
        })
    }

    if ('' === renavam.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Renavam inválido'
        })
    }

    if ('' === marca.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Marca inválida'
        })
    }

    if ('' === modelo.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Modelo inválido'
        })
    }

    const cat = cnh_requerida.toUpperCase()
    if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
        })
    }

    Veiculo.create({
        nome,
        placa,
        renavam,
        marca,
        modelo,
        cnh_requerida: cat
    })
    .then(veiculo => {
        res.status(HttpStatus.CREATED).json(veiculo.dataValues)
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

router.delete('/:veiculoId', check_auth, (req, res, next) => {
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