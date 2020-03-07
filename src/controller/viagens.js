const express = require('express')
const check_auth = require('../middleware/check_auth')
const viagens = require('../service/viagens')
const constantes = require('../constantes')
const router = express.Router()

router.get('/', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), viagens.get)

router.get('/:viagemId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), viagens.get_by_id)

router.get('/atual/:motoristaId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), viagens.get_atual_by_motorista)

router.post('/', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), viagens.iniciar)

router.put('/:viagemId', (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), viagens.concluir)

router.delete('/:viagemId', (req, res, next) => check_auth(req, res, next, constantes.ADMIN), viagens.deletar)

module.exports = router