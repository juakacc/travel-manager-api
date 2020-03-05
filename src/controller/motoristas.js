const express = require('express')
const check_auth = require('../middleware/check_auth')
const motoristas = require('../service/motoristas')

const router = express.Router()

router.get('/', check_auth, motoristas.get_all)

router.get('/:motoristaId', check_auth, motoristas.get_by_id)

router.post('/', motoristas.salvar)

router.put('/:motoristaId', motoristas.editar)

router.delete('/:motoristaId', check_auth, motoristas.deletar)

module.exports = router