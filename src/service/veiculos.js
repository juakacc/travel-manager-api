const Veiculo = require('../models').veiculo
const HttpStatus = require('http-status-codes')

exports.get_all = (req, res, next) => {
    Veiculo.findAll()
    .then(veiculos => {
        res.status(HttpStatus.OK).json(veiculos)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
}

exports.get_disponiveis = (req, res, next) => {
    Veiculo.findAll({
        where: { disponivel: true }        
    })
    .then(veiculos => {
        res.status(HttpStatus.OK).json(veiculos)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno no servidor'
        })
    })
}

exports.get_by_id = (req, res, next) => {
    const id = req.params.veiculoId

    Veiculo.findByPk(id)
    .then(veiculo => {
        if (!veiculo) {
            return res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Veiculo não encontrado'
            })
        } else {
            return res.status(HttpStatus.OK).json(veiculo.dataValues)
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
    const { nome, placa, renavam, marca, modelo, quilometragem, cnh_requerida } = req.body

    const salvar = {
        nome, placa, renavam, marca, modelo, quilometragem, cnh_requerida
    }

    if (nome) {
        if ('' === nome.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Nome inválido'
            })
        salvar.nome = nome.toUpperCase()
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O nome é obrigatório'
        })
    }

    if (placa) {
        if ('' === placa.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Placa inválida'
            })
        } else {
            const veiculo = await Veiculo.findAll({
                where: { placa }
            })
            if (veiculo.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    mensagem: 'A placa informada já está cadastrada'
                })
            }
            salvar.placa = placa.toUpperCase()
        }        
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A placa é obrigatória'
        })
    }

    if (renavam) {
        if ('' === renavam.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Renavam inválido'
            })
        }
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O número do renavam é obrigatório'
        })
    }

    if (marca) {
        if ('' === marca.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Marca inválida'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A marca é obrigatória'
        })
    }

    if (modelo) {
        if ('' === modelo.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Modelo inválido'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O modelo é obrigatório'
        })
    }

    if (quilometragem) {
        if (isNaN(quilometragem)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O valor da quilometragem é inválido'
            })
        }
    } else {
        delete salvar.quilometragem
    }

    if (cnh_requerida) {
        const cat = cnh_requerida.toUpperCase()
        if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
            })
        }
        salvar.cnh_requerida = cat
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A CNH requerida para esse veículo é obrigatória'
        })
    }

    Veiculo.create(salvar)
    .then(veiculo => {
        res.status(HttpStatus.CREATED).json(veiculo.dataValues)
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
}

exports.editar = async (req, res, next) => {
    const id = req.params.veiculoId
    const { nome, placa, renavam, marca, modelo, quilometragem, cnh_requerida } = req.body
    
    const veiculoBD = await Veiculo.findByPk(id)
    if (!veiculoBD)
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Veículo não encontrado'
        })

    const salvar = {
        nome, placa, renavam, marca, modelo, quilometragem, cnh_requerida
    }

    if (nome) {
        if ('' === nome.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Nome inválido'
            })
    } else {
        delete salvar.nome
    }

    if (placa) {    
        if ('' === placa.trim()) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Placa inválida'
            })
        } else {
            const veiculo = await Veiculo.findAll({
                where: { placa }
            })
            if (veiculo.length > 0)
                if (veiculo[0].id != id)
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        mensagem: 'A placa informada já está cadastrada'
                    })
        }
    } else {
        delete salvar.placa
    }

    if (renavam) {
        if ('' === renavam.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Renavam inválido'
            })
    } else {
        delete salvar.renavam
    }

    if (marca) {
        if ('' === marca.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Marca inválida'
            })
    } else {
        delete salvar.marca
    }
    
    if (modelo) {
        if ('' === modelo.trim())
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Modelo inválido'
            })
    } else {
        delete salvar.modelo
    }

    if (quilometragem) {
        if (isNaN(quilometragem)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O valor da quilometragem é inválido'
            })
        }
    } else {
        delete salvar.quilometragem
    }

    if (cnh_requerida) {
        const cat = cnh_requerida.toUpperCase()
        if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]'
            })
        }
        salvar.cnh_requerida = cat
    } else {
        delete salvar.cnh_requerida
    }

    Veiculo.update(salvar, {
        where: { id }
    })
    .then(() => {
        Veiculo.findByPk(id)
        .then(veiculo => {
            res.status(HttpStatus.OK).json(veiculo.dataValues)
        })
        .catch(err => {
            console.log(err)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno do servidor'
            })
        })        
    })
    .catch(err => {
        console.log(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno do servidor'
        })
    })
}

exports.deletar = (req, res, next) => {
    const id = req.params.veiculoId

    Veiculo.destroy({
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