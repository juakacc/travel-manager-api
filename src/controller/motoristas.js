const express = require('express')
const Motorista = require('../model/Motorista')
const HttpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.get('/', (req, res, next) => {
    Motorista.findAll()
    .then(motoristas => {
        const result = motoristas.map(motorista => {           
            motorista.senha = ''
            return motorista
        })
        res.status(HttpStatus.OK).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
})

router.get('/:motoristaId', (req, res, next) => {
    const id = req.params.motoristaId
    Motorista.findByPk(id)
    .then(motorista => {
        if (motorista == null) {
            res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Motorista não encontrado'
            })
        } else {
            motorista.senha = ''
            res.status(HttpStatus.OK).json(motorista)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
})

router.post('/', (req, res, next) => {
    const salt = bcrypt.genSaltSync(10)
    const senha = bcrypt.hashSync(req.body.senha, salt)

    // validar categoria

    Motorista.create({
        nome: req.body.nome,
        apelido: req.body.apelido.toLowerCase(),
        cnh: req.body.cnh,
        categoria: req.body.categoria,
        telefone: req.body.telefone,
        senha: senha
    })
    .then(motorista => {
        delete motorista.dataValues.senha
        res.status(HttpStatus.CREATED).json(motorista.dataValues)    
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno do servidor'
        })
    })
})

router.delete('/:motoristaId', (req, res, next) => {
    const id = req.params.motoristaId

    Motorista.destroy({
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

// /dados/{apelido} enviar dados no token

module.exports = router