const express = require('express')
const check_auth = require('../middleware/check_auth')
const motoristas = require('../service/motoristas')
const constantes = require('../constantes')
const router = express.Router()

router.get('/', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), motoristas.get_all)

router.get('/:motoristaId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), motoristas.get_by_id)

router.post('/', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), motoristas.salvar)

router.put('/:motoristaId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), motoristas.editar)

router.delete('/:motoristaId', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), motoristas.deletar)

module.exports = router