const Motorista = require('../models').motorista
const Permissao = require('../models').auth_permissoes
const HttpStatus = require('http-status-codes')
const bcrypt = require('bcryptjs')
const constantes = require('../constantes')

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
        if (!motorista) {
            res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Motorista não encontrado'
            })
        } else {
            Permissao.findAll({
                where: { id_motorista: id }
            })
            .then(per => {
                const permissoes = per.map(item => {
                    return item.dataValues.permissao
                })
                motorista.dataValues.permissoes = permissoes.length > 0 ? permissoes : [constantes.MOTORISTA]
                delete motorista.dataValues.senha
                res.status(HttpStatus.OK).json(motorista.dataValues)
            })
            .catch(err => {
                console.log(err)
                delete motorista.dataValues.senha
                res.status(HttpStatus.OK).json(motorista.dataValues)
            })            
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
    const { nome, apelido, cnh, categoria, telefone, senha, permissoes } = req.body
    
    const salvar = {
        nome, apelido, cnh, categoria, telefone, senha, permissoes
    }

    if (nome) {
        if ('' === nome.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Nome inválido'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O nome é obrigatório'
        })
    }

    if (apelido) {
        if ('' === apelido.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Apelido inválido'
            })
        } else {
            const aux = await Motorista.findAll({
                where: { apelido }
            })
            if (aux.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    mensagem: 'O apelido já está em uso'
                })
            }
            salvar.apelido = apelido.toLowerCase()
        }
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O apelido é obrigatório'
        })
    }
    
    if (senha) {
        if ('' === senha.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Senha inválida'
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const senhaEnc = bcrypt.hashSync(senha, salt)
            salvar.senha = senhaEnc
        }
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A senha é obrigatória'
        })
    }

    if (telefone) {
        if ('' === telefone.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Telefone inválido'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O telefone é obrigatório'
        })
    }

    if (categoria) {
        const cat = categoria.toUpperCase()
        if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
            })
        }
        salvar.categoria = cat
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A categoria da CNH é obrigatória'
        })
    }

    if (cnh) {
        if ('' === cnh.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Número da CNH inválido'
            })
        } else {
            const aux = await Motorista.findAll({
                where: { cnh }
            })
            if (aux.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    mensagem: 'A CNH informada já está cadastrada'
                })
            }
        }
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O número da CNH é obrigatório'
        })
    } 

    Motorista.create(salvar)
    .then(motorista => {
        delete motorista.dataValues.senha

        Permissao.create({  // padrao
            id_motorista: motorista.id,
            permissao: constantes.MOTORISTA
        })
        if (permissoes && permissoes.admin) {
            Permissao.create({
                id_motorista: motorista.id,
                permissao: constantes.ADMIN
            })
        }
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

    if (!req.userData.roles.includes(constantes.ADMIN) && req.userData.id != id) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            mensagem: 'Você não tem autorização para alterar esse motorista!'
        })
    }

    const salvar = {
        nome, apelido, cnh, categoria, telefone
    }

    if (nome) {
        if ('' === nome.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Nome inválido'
            })
    } else {
        delete salvar.nome
    }
    

    if (apelido) {
        if ('' === apelido.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Apelido inválido'
            })
        } else {
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
            salvar.apelido = apelido.toLowerCase()
        }        
    } else {
        delete salvar.apelido
    }
    
    if (telefone) {
        if ('' === telefone.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Telefone inválido'
            })
    } else {
        delete salvar.telefone
    }    

    if (categoria) {
        const cat = categoria.toUpperCase()
        if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat))
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
            })
        salvar.categoria = cat
    } else {
        delete salvar.categoria
    }

    if (cnh) {
        if ('' === cnh.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Número da CNH inválido'
            })
        } else {
            const motorista = await Motorista.findAll({
                where: { cnh }
            })
            if (motorista.length > 0) {
                if (motorista[0].id != id) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        mensagem: 'A CNH informada já está em uso'
                    })
                }
            }
        }        
    } else {
        delete salvar.cnh
    }

    Motorista.update(salvar, {
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