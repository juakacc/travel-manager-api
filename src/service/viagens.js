const HttpStatus = require('http-status-codes');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');
const checkCNH = require('../utils');

const models = require('../models');
const Veiculo = models.veiculo;
const Motorista = models.motorista;
const Viagem = models.viagem;

const padrao = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
const padrao2 = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/; // app antigo

exports.get = (req, res) => {
  const { date, status } = req.query;

  if (status) {
    const s = status.toLowerCase();

    switch (s) {
      case 'concluida':
        Viagem.findAll({
          where: {
            chegada: {
              [Op.not]: null,
            },
          },
          include: [Veiculo, Motorista],
          limit: 5,
          order: [['chegada', 'DESC']],
        })
          .then(viagens => {
            const result = viagens.map(viagem => {
              return convertViagem(viagem);
            });
            return res.status(HttpStatus.OK).json(result);
          })
          .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              mensagem: 'Erro interno no servidor',
            });
          });
        break;
      case 'nao-concluida':
        Viagem.findAll({
          where: {
            chegada: {
              [Op.is]: null,
            },
          },
          include: [Veiculo, Motorista],
          order: [['saida', 'DESC']],
        })
          .then(viagens => {
            const result = viagens.map(viagem => {
              return convertViagem(viagem);
            });
            return res.status(HttpStatus.OK).json(result);
          })
          .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              mensagem: 'Erro interno no servidor',
            });
          });
        break;
      default:
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: 'Status inválido',
        });
    }
  } else if (date) {
    const data = date.replace('T', ' ');
    const s = new Date(data);
    console.log('enviada: ' + moment(data).format())
    console.log('agora: ' + moment().format())

    if ((!padrao.test(data) && !padrao2.test(data)) || isNaN(s.getTime())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: 'A data não segue o padrão: yyyy-MM-dd HH:mm:ss',
      });
    }

    const data2 = moment(data).format()

    Viagem.findAll({
      where: {
        [Op.and]: [
          {
            saida: {
              [Op.lte]: data2,
            },
          },
          {
            [Op.or]: [
              {
                chegada: {
                  [Op.is]: null,
                },
              },
              {
                chegada: {
                  [Op.gte]: data2,
                },
              },
            ],
          },
        ],
      },
      include: [Veiculo, Motorista],
    })
      .then(viagens => {
        const result = viagens.map(viagem => {
          return convertViagem(viagem);
        });
        return res.status(HttpStatus.OK).json(result);
      })
      .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          mensagem: 'Erro interno no servidor',
        });
      });
  } else {
    Viagem.findAll({
      include: [Veiculo, Motorista],
      limit: 5,
    })
      .then(viagens => {
        const result = viagens.map(viagem => {
          return convertViagem(viagem);
        });
        return res.status(HttpStatus.OK).json(result);
      })
      .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          mensagem: err,
        });
      });
  }
};

exports.get_by_id = async (req, res) => {
  Viagem.findByPk(req.params.viagemId, {
    include: [Veiculo, Motorista],
  })
    .then(viagem => {
      if (!viagem)
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: 'Viagem não encontrada',
        });
      res.status(HttpStatus.OK).json(convertViagem(viagem));
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Ocorreu um erro interno no servidor',
      });
    });
};

exports.get_atual_by_motorista = (req, res, next) => {
  const motoristaId = req.userData.id;

  Viagem.findOne({
    where: {
      id_motorista: motoristaId,
      chegada: {
        [Op.is]: null,
      },
    },
    include: [Veiculo, Motorista],
  })
    .then(viagem => {
      if (!viagem)
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: 'Viagem não encontrada',
        });
      return res.status(HttpStatus.OK).json(convertViagem(viagem));
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Ocorreu um erro interno no servidor',
      });
    });
};

exports.iniciar = async (req, res) => {
  const { km_inicial, descricao, veiculo } = req.body;
  const motorista = req.userData.id;
  const errors = [];

  const veiculoBD = await Veiculo.findByPk(veiculo);

  if (!veiculoBD) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Veículo inexistente',
    });
  } else if (!veiculoBD.dataValues.disponivel) {
    errors.push('Veículo indisponível');
  }

  const motoristaBD = await Motorista.findByPk(motorista);

  if (!motoristaBD.dataValues.disponivel) {
    errors.push('Motorista indisponível');
  }

  const salvar = {
    saida: moment().format(),
    km_inicial,
    descricao,
    id_veiculo: veiculo,
    id_motorista: motorista,
  };

  if (motoristaBD)
    if (
      !checkCNH(
        motoristaBD.dataValues.categoria,
        veiculoBD.dataValues.cnh_requerida,
      )
    )
      errors.push(
        `Habilitação necessária: ${veiculoBD.dataValues.cnh_requerida}`,
      );

  if (!km_inicial || isNaN(km_inicial)) {
    errors.push('O valor da quilometragem é inválido');
  } else {
    salvar.km_inicial = parseFloat(km_inicial);
  }

  if (errors.length > 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Parâmetro(s) inválido(s)',
      errors,
    });
  }

  return models.sequelize
    .transaction(t => {
      return Viagem.create(salvar, { transaction: t }).then(viagemSalva => {
        return Promise.all([
          Veiculo.update(
            {
              disponivel: false,
              quilometragem: salvar.km_inicial,
            },
            { where: { id: veiculo }, transaction: t },
          ),
          Motorista.update(
            {
              disponivel: false,
            },
            { where: { id: motorista }, transaction: t },
          ),
        ]).then(() => {
          return viagemSalva;
        });
      });
    })
    .then(viagemSalva => {
      return Viagem.findByPk(viagemSalva.id, {
        include: [Veiculo, Motorista],
      }).then(viagem => {
        return res.status(HttpStatus.CREATED).json(convertViagem(viagem));
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Ocorreu um erro interno no servidor',
      });
    });
};

exports.concluir = async (req, res) => {
  const { viagemId } = req.params;
  const errors = [];

  const viagem = await Viagem.findByPk(viagemId);
  if (!viagem) errors.push('Viagem não encontrada');

  const { km_final, descricao } = req.body;

  const salvar = {
    chegada: moment().format(),
    km_final,
    descricao,
  };

  if (!salvar.km_final || isNaN(salvar.km_final)) {
    errors.push('O valor da quilometragem final é inválido');
  } else {
    salvar.km_final = parseFloat(salvar.km_final);
  }
  const km_inicial = parseFloat(viagem.dataValues.km_inicial);

  if (salvar.km_final < km_inicial)
    errors.push(
      `KM final (${salvar.km_final}KM) não pode ser menor que KM inicial (${km_inicial}KM)`,
    );

  if (errors.length > 0)
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Parâmetro(s) inválido(s)',
      errors,
    });

  return models.sequelize
    .transaction(t => {
      return Viagem.update(salvar, {
        where: { id: viagemId },
        transaction: t,
      }).then(() => {
        return Viagem.findByPk(viagemId, {
          include: [Veiculo, Motorista],
          transaction: t,
        }).then(viagem => {
          return Promise.all([
            Veiculo.update(
              {
                disponivel: true,
                quilometragem: salvar.km_final,
              },
              { where: { id: viagem.dataValues.id_veiculo }, transaction: t },
            ),
            Motorista.update(
              {
                disponivel: true,
              },
              { where: { id: viagem.dataValues.id_motorista }, transaction: t },
            ),
          ]).then(() => {
            return viagem;
          });
        });
      });
    })
    .then(viagem => {
      return res.status(HttpStatus.OK).json(convertViagem(viagem));
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Ocorreu um erro interno no servidor',
      });
    });
};

exports.deletar = async (req, res) => {
  const id = req.params.viagemId;

  const viagem = await Viagem.findByPk(id);
  if (!viagem)
    return res.status(HttpStatus.NOT_FOUND).json({
      mensagem: 'Viagem não encontrada',
    });

  const veiculoId = viagem.dataValues.id_veiculo;
  const motoristaId = viagem.dataValues.id_motorista;
  const nao_concluida = viagem.dataValues.chegada == null;

  return models.sequelize
    .transaction(t => {
      return Viagem.destroy({
        where: { id },
        transaction: t,
      }).then(rows => {
        if (rows > 0 && nao_concluida) {
          return Promise.all([
            Veiculo.update(
              {
                disponivel: true,
              },
              { where: { id: veiculoId }, transaction: t },
            ),
            Motorista.update(
              {
                disponivel: true,
              },
              { where: { id: motoristaId }, transaction: t },
            ),
          ]);
        }
      });
    })
    .then(() => {
      return res.status(HttpStatus.NO_CONTENT).send();
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Ocorreu um erro interno no servidor',
      });
    });
};

const convertViagem = viagem => {
  const {
    id,
    saida,
    km_inicial,
    chegada,
    km_final,
    descricao,
    veiculo,
    motoristum,
  } = viagem.dataValues;

  const vi = {
    id,
    saida,
    km_inicial,
    chegada,
    km_final,
    descricao,
    veiculo: {
      ...veiculo.dataValues,
    },
    motorista: {
      ...motoristum.dataValues,
    },
  };
  delete vi.motorista.senha;
  return vi;
};
