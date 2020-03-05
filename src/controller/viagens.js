const express = require('express')
const check_auth = require('../middleware/check_auth')
const viagens = require('../service/viagens')
const router = express.Router()

router.get('/', check_auth, viagens.get)

router.get('/:viagemId', check_auth, viagens.get_by_id)

router.get('/atual/:motoristaId', check_auth, viagens.get_atual_by_motorista)

router.post('/', check_auth, viagens.iniciar)

router.put('/:viagemId', check_auth, viagens.concluir)

router.delete('/:viagemId', check_auth, viagens.deletar)

module.exports = router