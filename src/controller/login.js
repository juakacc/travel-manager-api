const express = require('express')
const HttpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Motorista = require('../models').motorista

const router = express.Router()

router.post('/', (req, res, next) => {

    const { apelido, senha } = req.body

    Motorista.findAll({
        where: { apelido }
    })
    .then(motoristas => {
        if (motoristas.length < 1) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Apelido inválido'
            })
        } 
        const motorista = motoristas[0].dataValues

        if (!bcrypt.compareSync(senha, motorista.senha)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Senha incorreta'
            })
        }

        const token = jwt.sign({
            id: motorista.id,
            apelido: motorista.apelido
        }, process.env.SECRET_KEY_TOKEN, {
            expiresIn: '30days'
        })

        return res.status(HttpStatus.OK).json({
            id: motorista.id,
            token
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

module.exports = router