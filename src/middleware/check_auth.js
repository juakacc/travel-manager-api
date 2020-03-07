const HttpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const Permissao = require('../models').auth_permissoes
const Papel = require('../models').auth_papeis
require('dotenv').config()

const check = (req, res, next, role) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodificado = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        const id_motorista = decodificado.id
        
        Permissao.findAll({
            where: { id_motorista },
            include: [Papel]
        })
        .then(p => {
            const permissoes = p.map(item => {
                return item.dataValues.auth_papei.dataValues.nome
            })
            if (permissoes.includes(role)) {
                req.userData = decodificado
                next()        
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    mensagem: 'Ausência de permissão',
                    tokenExpirado : false
                })
            }
        })
        .catch(err => {
            console.error(err)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno no servidor',
                tokenExpirado : false
            })
        })        
    } catch (erro) {
        const tokenExpirado = erro.name === 'TokenExpiredError'

        return res.status(HttpStatus.UNAUTHORIZED).json({
            mensagem: 'Sem permissão para acesso',
            tokenExpirado,
            erro
        })
    }
}

module.exports = check