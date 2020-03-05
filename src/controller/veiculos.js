const express = require('express')
const check_auth = require('../middleware/check_auth')
const veiculos = require('../service/veiculos')
const router = express.Router()

router.get('/', check_auth, veiculos.get_all)

router.get('/disponiveis', check_auth, veiculos.get_disponiveis)

router.get('/:veiculoId', check_auth, veiculos.get_by_id)

router.post('/', check_auth, veiculos.salvar)

router.put('/:veiculoId', check_auth, veiculos.editar)

router.delete('/:veiculoId', check_auth, veiculos.deletar)

module.exports = router