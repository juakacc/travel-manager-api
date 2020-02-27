const express = require('express')
const Motorista = require('../models').motorista
const HttpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')
const check_auth = require('../middleware/check_auth')

const router = express.Router()

router.get('/', check_auth, (req, res, next) => {
    Motorista.findAll()
    .then(motoristas => {
        const result = motoristas.map(motorista => {
            delete motorista.dataValues.senha
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

router.get('/:motoristaId', check_auth, (req, res, next) => {
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

router.post('/', async (req, res, next) => {

    const { nome, apelido, cnh, categoria, telefone, senha } = req.body

    if ('' === nome.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Nome inválido'
        })
    }

    if ('' === apelido.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Apelido inválido'
        })
    }

    if ('' === senha.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Senha inválida'
        })
    }

    if ('' === telefone.trim()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Telefone inválido'
        })
    }

    const cat = categoria.toUpperCase()
    if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
        })
    }

    const motorista = await Motorista.findAll({
        where: { apelido }
    })
    if (motorista.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Apelido já cadastrado'
        })
    }

    const motorista2 = await Motorista.findAll({
        where: { cnh }
    })
    if (motorista2.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Não é permitido CNH duplicada'
        })
    }   

    const salt = bcrypt.genSaltSync(10)
    const senhaEnc = bcrypt.hashSync(senha, salt)

    Motorista.create({
        nome,
        apelido: apelido.toLowerCase(),
        cnh,
        categoria: cat,
        telefone,
        senha: senhaEnc
    })
    .then(motorista => {
        delete motorista.dataValues.senha
        return res.status(HttpStatus.CREATED).json(motorista.dataValues)    
    })
    .catch(err => {
        console.log(err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno do servidor'
        })
    })
})

router.delete('/:motoristaId', check_auth, (req, res, next) => {
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

module.exports = router