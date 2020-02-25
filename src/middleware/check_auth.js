const HttpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const check = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodificado = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        req.userData = decodificado
        next()
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