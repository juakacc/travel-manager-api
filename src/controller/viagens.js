const express = require('express')
const HttpStatus = require('http-status-codes')
const sequelize = require('sequelize')
const Op = sequelize.Op

const Veiculo = require('../model/Veiculo')
const Motorista = require('../model/Motorista')
const Viagem = require('../model/Viagem')

const router = express.Router()

router.get('/', (req, res, next) => {

    const { date, status } = req.query

    if (status) {
        const s = status.toLowerCase()

        switch (s) {
            case 'concluida':
                Viagem.findAll({
                    where: {
                        chegada: {
                            [Op.not]: null
                        }
                    }
                })
                .then(viagens => {
                    return res.status(HttpStatus.OK).json(viagens)
                })
                .catch(err => {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        mensagem: 'Erro interno no servidor'
                    })
                })
                break
            case 'nao-concluida':
                Viagem.findAll({
                    where: {
                        chegada: {
                            [Op.is]: null
                        }        
                    }
                })
                .then(viagens => {
                    return res.status(HttpStatus.OK).json(viagens)
                })
                .catch(err => {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        mensagem: 'Erro interno no servidor'
                    })
                })
                break
            default:
                return res.status(HttpStatus.BAD_REQUEST).json({
                    mensagem: 'Status inválido'
                })
        }
    } else if (date) {
        Viagem.findAll({
            where: {
                [Op.or]: {
                    [Op.and]: {
                        chegada: null,
                        saida: {
                            lte: date
                        }
                    },
                    [Op.and]: {
                        saida: {
                            lte: date
                        },
                        chegada: {
                            gte: date
                        }
                    }                    
                }
            }
        })
        .then(viagens => {
            return res.status(HttpStatus.OK).json(viagens)
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno no servidor'
            })
        })
    } else {
        Viagem.findAll()
        .then(viagens => {
            return res.status(HttpStatus.OK).json(viagens)
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno no servidor'
            })
        })
    }    
})

router.get('/:viagemId', (req, res, next) => {
    Viagem.findByPk(req.params.viagemId)
    .then(viagem => {
        if (!viagem) {
            return res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Viagem não encontrada'
            })
        }
        res.status(HttpStatus.OK).json(viagem)
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

router.get('/atual/:motoristaId', (req, res, next) => {
    const { motoristaId } = req.params

    Viagem.findAll({
        where: {
            id_motorista: motoristaId, 
            chegada: {
                [Op.is]: null
            }
        }
    })
    .then(viagens => {
        if (viagens.length == 0) {
            res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Viagem não encontrada'
            })
        }
        res.status(HttpStatus.OK).json(viagens[0])
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Ocorreu um erro interno no servidor'
        })
    })
})

router.post('/', async (req, res, next) => {

    const { saida, km_inicial, descricao, veiculo, motorista } = req.body

    const veiculoBD = await Veiculo.findByPk(veiculo)
    if (!veiculoBD) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Veículo inexistente'
        })
    }
    if (!veiculoBD.dataValues.disponivel) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Veículo indisponível'
        })
    }

    const motoristaBD = await Motorista.findByPk(motorista)
    if (!motoristaBD) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Motorista inexistente'
        })
    }
    if (!motoristaBD.dataValues.disponivel) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Motorista indisponível'
        })
    }

    // Verificar habilitação

    Viagem.create({
        saida,
        km_inicial,
        descricao,
        id_veiculo: veiculo,
        id_motorista: motorista
    })
    .then(viagem => {
        Veiculo.update({
            disponivel: false
        }, { where: { id: veiculo } })

        Motorista.update({
            disponivel: false
        }, { where: { id: motorista } })

        return res.status(HttpStatus.CREATED).json(viagem)
    })
    .catch(err => {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: err
        })
    })
})

router.put('/:viagemId', async (req, res, next) => {
    const { viagemId } = req.params

    const viagem = await Viagem.findByPk(viagemId)
    if (!viagem) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Viagem não encontrada'
        })
    }

    const { saida, chegada, km_inicial, km_final, descricao, veiculo, motorista } = req.body

    // Validar informações

    Viagem.update({
        saida,
        chegada, 
        km_inicial,
        km_final,
        descricao,
        // id_veiculo: veiculo,
        // id_motorista: motorista
    }, { where: { id: viagemId } })
    .then(viagem => {
        Veiculo.update({
            disponivel: true
        }, { where: { id: veiculo } })

        Motorista.update({
            disponivel: true
        }, { where: { id: motorista } })

        Viagem.findByPk(viagemId)
        .then(viagem => {
            return res.status(HttpStatus.OK).json(viagem)
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: err
            })
        })        
    })
    .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
})

router.delete('/:viagemId', (req, res, next) => {
    const id = req.params.viagemId

    Viagem.destroy({
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
})

module.exports = router