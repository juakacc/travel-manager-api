const HttpStatus = require('http-status-codes')
const sequelize = require('sequelize')
const Op = sequelize.Op
const Veiculo = require('../models').veiculo
const Motorista = require('../models').motorista
const Viagem = require('../models').viagem

const convertViagem = viagem => {
    const vi = {
        id: viagem.dataValues.id,
        saida: viagem.dataValues.saida,
        km_inicial: viagem.dataValues.km_inicial,
        chegada: viagem.dataValues.chegada,
        km_final: viagem.dataValues.km_final,
        descricao: viagem.dataValues.descricao,
        veiculo: {
            ...viagem.dataValues.veiculo.dataValues
        },
        motorista: {
            ...viagem.dataValues.motoristum.dataValues
        }
    }
    delete vi.motorista.senha
    return vi
}

const checkCNH = (motorista, veiculo) => {

    if (motorista == veiculo) return true;
		
    if (motorista == null || veiculo == null) return false;
    
    switch (veiculo) {
        case 'A':
            return ['AB', 'AC', 'AD', 'AE'].includes(motorista)
        case 'B':
            return ['AB', 'AC', 'AD', 'AE', 'C', 'D', 'E'].includes(motorista)
        case 'C':
            return ['AC', 'AD', 'AE', 'D', 'E'].includes(motorista)
        case 'D':
            return ['AD', 'E', 'AE'].includes(motorista)
        case 'E':
            return ['AE'].includes(motorista)
        default:
            return false;
    }
}

exports.get = (req, res, next) => {

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
                    },
                    include: [Veiculo, Motorista],
                    limit: 5,
                    order: [['chegada', 'DESC']]
                })
                .then(viagens => {
                    const result = viagens.map(viagem => {
                        return convertViagem(viagem)
                    })
                    return res.status(HttpStatus.OK).json(result)
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
                    },
                    include: [Veiculo, Motorista],
                    order: [['saida', 'DESC']]
                })
                .then(viagens => {
                    const result = viagens.map(viagem => {
                        return convertViagem(viagem)
                    })
                    return res.status(HttpStatus.OK).json(result)
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
                [Op.and]: [{
                        saida: {
                            [Op.lte]: date
                        }
                    }, {
                        [Op.or]: [{
                            chegada: {
                                [Op.is]: null
                            }
                        }, {
                            chegada: {
                                [Op.gte]: date
                            }
                        }]
                    }]
            },
            include: [Veiculo, Motorista]
        })
        .then(viagens => {
            const result = viagens.map(viagem => {
                return convertViagem(viagem)
            })
            return res.status(HttpStatus.OK).json(result)
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: 'Erro interno no servidor'
            })
        })
    } else {
        Viagem.findAll({
            include: [Veiculo, Motorista],
            limit: 5
        })
        .then(viagens => {
            const result = viagens.map(viagem => {
                return convertViagem(viagem)
            })
            return res.status(HttpStatus.OK).json(result)
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: err
            })
        })
    }    
}

exports.get_by_id = async (req, res, next) => {

    Viagem.findByPk(req.params.viagemId, { 
        include: [Veiculo, Motorista] 
    })
    .then(viagem => {
        if (!viagem) {
            return res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Viagem não encontrada'
            })
        } else {
            res.status(HttpStatus.OK).json(convertViagem(viagem))
        }        
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
}

exports.get_atual_by_motorista = (req, res, next) => {
    const { motoristaId } = req.params

    Viagem.findAll({
        where: {
            id_motorista: motoristaId, 
            chegada: {
                [Op.is]: null
            }
        },
        include: [Veiculo, Motorista] 
    })
    .then(viagens => {
        if (viagens.length == 0) {
            return res.status(HttpStatus.NOT_FOUND).json({
                mensagem: 'Viagem não encontrada'
            })
        }
        return res.status(HttpStatus.OK).json(convertViagem(viagens[0]))
    })
    .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Ocorreu um erro interno no servidor'
        })
    })
}

exports.iniciar = async (req, res, next) => {
    const { saida, km_inicial, descricao, veiculo, motorista } = req.body

    const veiculoBD = await Veiculo.findByPk(veiculo)

    if (veiculo) {    
        if (!veiculoBD)
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Veículo inexistente'
            })

        if (!veiculoBD.dataValues.disponivel)
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Veículo indisponível'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O veículo é obrigatório'
        })
    }

    const motoristaBD = await Motorista.findByPk(motorista)

    if (motorista) {
        if (!motoristaBD)
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Motorista inexistente'
            })

        if (!motoristaBD.dataValues.disponivel)
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'Motorista indisponível'
            })
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O motorista é obrigatório'
        })
    }

    const salvar = {
        saida, km_inicial, descricao, 
        id_veiculo: veiculo,
        id_motorista: motorista
    }

    if (!checkCNH(motoristaBD.dataValues.categoria, veiculoBD.dataValues.cnh_requerida)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'CNH incompatível com a requerida pelo veículo'
        })
    }
    
    if (saida) {
        const data = saida.replace("T", " ")
        const padrao = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/
        const padrao2 = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/ // app antigo
        const s = new Date(data)

        if ((!padrao.test(data) && !padrao2.test(data)) || isNaN(s.getTime())) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'A data não segue o padrão: yyyy-MM-dd HH:mm:ss'
            })
        }
        salvar.saida = data
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O momento da saída é obrigatório'
        })
    }

    if (km_inicial) {
        if (isNaN(km_inicial)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O valor da quilometragem é inválido'
            })
        }
        salvar.km_inicial = parseFloat(km_inicial)
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'O KM inicial é obrigatório'
        })
    }

    Viagem.create(salvar)
    .then(viagem => {
        Veiculo.update({
            disponivel: false
        }, { where: { id: veiculo } })

        Motorista.update({
            disponivel: false
        }, { where: { id: motorista } })

        Viagem.findByPk(viagem.id, {
            include: [Veiculo, Motorista] 
        })
        .then(viagem => {
            res.status(HttpStatus.OK).json(convertViagem(viagem))
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: err
            })
        })
    })
    .catch(err => {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: err
        })
    })
}

exports.concluir = async (req, res, next) => {
    const { viagemId } = req.params
    
    const viagem = await Viagem.findByPk(viagemId)
    if (!viagem) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Viagem não encontrada'
        })
    }  

    const { saida, chegada, km_inicial, km_final, descricao } = req.body
    const salvar = {
        saida, chegada, km_final, km_inicial, descricao
    }

    const padrao = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/
    const padrao2 = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/ // app antigo
    
    if (saida) {
        const aux = saida.replace("T", " ")    
        const s = new Date(aux)

        if ((!padrao.test(aux) && !padrao2.test(aux)) || isNaN(s.getTime())) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'A data de saída não segue o padrão: yyyy-MM-dd HH:mm:ss'
            })
        }
    } else {
        delete salvar.saida
    }

    if (km_inicial) {
        if (isNaN(km_inicial)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O valor da quilometragem inicial é inválido'
            })
        }
        salvar.km_inicial = parseFloat(km_inicial)
    } else {
        delete salvar.km_inicial
    }

    if (km_final) {
        if (isNaN(km_final)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'O valor da quilometragem final é inválido'
            })
        }
        salvar.km_final = parseFloat(km_final)
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A quilometragem final é obrigatória'
        })
    }

    var inicialKm = km_inicial
    if (!inicialKm) {
        inicialKm = viagem.dataValues.km_inicial
    }

    if (parseFloat(km_final) < parseFloat(inicialKm)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: `KM final (${km_final}KM) não pode ser menor que KM inicial (${inicialKm}KM)`
        })
    }

    if (chegada) {
        const aux = chegada.replace("T", " ")
        const s = new Date(aux)

        if ((!padrao.test(aux) && !padrao2.test(aux)) || isNaN(s.getTime())) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                mensagem: 'A data de chegada não segue o padrão: yyyy-MM-dd HH:mm:ss'
            })
        }
    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'A momento de chegada é obrigatória'
        })
    }

    var saidaAux = saida

    if (!saidaAux) {
        saidaAux = viagem.dataValues.saida // Se ele não enviou agora eu pego a data salva em banco
    }

    const dataSaida = new Date(saidaAux)
    const dataChegada = new Date(chegada)

    if (dataChegada < dataSaida) {
        res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: 'Data de chegada anterior a data de saída'
        })
    }

    Viagem.update(salvar, 
        { where: { id: viagemId } })
    .then(() => {

        Viagem.findByPk(viagemId, {
            include: [Veiculo, Motorista]
        })
        .then(viagem => {

            Veiculo.update({
                disponivel: true,
                quilometragem: salvar.km_final
            }, { where: { id: viagem.dataValues.id_veiculo } })

            Motorista.update({
                disponivel: true
            }, { where: { id: viagem.dataValues.id_motorista } })

            return res.status(HttpStatus.OK).json(convertViagem(viagem))
        })
        .catch(err => {
            console.log(err)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                mensagem: err
            })
        })        
    })
    .catch(err => {
        console.log(err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
}

exports.deletar = async (req, res, next) => {
    const id = req.params.viagemId

    const viagem = await Viagem.findByPk(id)
    if (!viagem) {
        return res.status(HttpStatus.NOT_FOUND).json({
            mensagem: 'Viagem não encontrada'
        })
    }

    const veiculoId = viagem.dataValues.id_veiculo
    const motoristaId = viagem.dataValues.id_motorista
    const nao_concluida = viagem.dataValues.chegada == null

    Viagem.destroy({
        where: { id }
    })
    .then(rows => {
        if (rows > 0) {
            if (nao_concluida) {
                Veiculo.update({
                    disponivel: true
                }, { where: { id: veiculoId } })
    
                Motorista.update({
                    disponivel: true
                }, { where: { id: motoristaId } })
            }
        }
        res.status(HttpStatus.NO_CONTENT).send()
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err
        })
    })
}