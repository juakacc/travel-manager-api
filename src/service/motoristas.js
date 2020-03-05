const Motorista = require('../models').motorista
const HttpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')

exports.get_all = (req, res, next) => {
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
}

exports.get_by_id = (req, res, next) => {
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
}

exports.salvar = async (req, res, next) => {

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
            mensagem: 'O apelido já está em uso'
        })
    }

    const motorista2 = await Motorista.findAll({
        where: { cnh }
    })
    if (motorista2.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A CNH informada já está cadastrada'
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
}

exports.editar = async (req, res, next) => {

    const id = req.params.motoristaId
    const { nome, apelido, cnh, categoria, telefone } = req.body

    const motoristaBD = await Motorista.findByPk(id)
    if (!motoristaBD) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Motorista não encontrado'
        })
    }  

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
        if (motorista[0].id != id) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O apelido já está em uso'
            })
        }
    }

    const motorista2 = await Motorista.findAll({
        where: { cnh }
    })
    if (motorista2.length > 0) {
        if (motorista2[0].id != id) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'A CNH informada já está em uso'
            })
        }
    }

    Motorista.update({
        nome,
        apelido: apelido.toLowerCase(),
        cnh,
        categoria: cat,
        telefone
    }, {
        where: { id }
    })
    .then(() => {
        Motorista.findByPk(id)
        .then(motorista2 => {
            delete motorista2.dataValues.senha
            return res.status(HttpStatus.OK).json(motorista2.dataValues)
        })
        .catch(err => {
            console.log(err)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno no servidor'
            })
        })            
    })
    .catch(err => {
        console.log(err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno do servidor'
        })
    })
}

exports.deletar = (req, res, next) => {
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
}