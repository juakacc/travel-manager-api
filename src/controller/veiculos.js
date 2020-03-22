const express = require('express')
const check_auth = require('../middleware/check_auth')
const veiculos = require('../service/veiculos')
const constantes = require('../constantes')
const router = express.Router()

router.get('/', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), veiculos.get_all)

router.get('/disponiveis', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), veiculos.get_disponiveis)

router.get('/:veiculoId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), veiculos.get_by_id)

router.post('/', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), veiculos.salvar)

router.put('/:veiculoId', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), veiculos.editar)

router.delete('/:veiculoId', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), veiculos.deletar)

module.exports = router