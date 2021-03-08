const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const HttpStatus = require('http-status-codes');
const moment = require('moment');

const Motorista = require('../models').motorista;
const Veiculo = require('../models').veiculo;
const Servico = require('../models').servico;
const Revisao = require('../models').servico_revisao;

const checkCNH = require('../utils');

exports.get_all = (req, res, next) => {
  Veiculo.findAll({
    attributes: ['id', 'nome', 'placa', 'renavam', 'marca', 'modelo', 'quilometragem', 'disponivel', 'cnh_requerida'], 
    order: [
      ['nome', 'ASC']
    ]
  })
    .then(veiculos => {
      res.status(HttpStatus.OK).json(veiculos);
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro interno no servidor',
      });
    });
};

exports.get_disponiveis = (req, res, next) => {
  Veiculo.findAll({
    where: { disponivel: true },
    attributes: ['id', 'nome', 'placa', 'renavam', 'marca', 'modelo', 'quilometragem', 'cnh_requerida'], 
    order: [
      ['nome', 'ASC']
    ]
  })
    .then(veiculos => {
      const motorista_id = req.userData.id;

      Motorista.findByPk(motorista_id).then(motoristaBD => {
        const categoria = motoristaBD.dataValues.categoria;
        res.status(HttpStatus.OK).json(veiculos.filter(v => checkCNH(categoria, v.cnh_requerida)));
      })      
      .catch(() => {
        res.status(HttpStatus.OK).json(veiculos);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro interno no servidor',
      });
    });
};

exports.get_by_id = (req, res, next) => {
  const id = req.params.veiculoId;

  Veiculo.findByPk(id)
    .then(veiculo => {
      if (!veiculo) {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: 'Veiculo não encontrado',
        });
      } else {
        return res.status(HttpStatus.OK).json(veiculo.dataValues);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro interno no servidor',
      });
    });
};

exports.get_revisoes = (req, res, next) => {
  const id = req.params.veiculoId;

  Veiculo.findByPk(id)
    .then(veiculo => {
      if (veiculo) {
        Revisao.findAll({
          where: {
            [Op.and]: [
              {
                realizada: false,
              },
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      // IF momento == null => !realizada && revisao.quilometragem <= veiculo.quilometragem
                      {
                        quilometragem: {
                          [Op.not]: null,
                        },
                      },
                      {
                        quilometragem: {
                          [Op.lte]: veiculo.quilometragem,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      // ELSE !realizada && revisao.momento <= data_atual
                      {
                        momento: {
                          [Op.not]: null,
                        },
                      },
                      {
                        momento: {
                          [Op.lte]: moment()
                            .utcOffset(-180)
                            .format('YYYY-MM-DD HH:mm:ss'), // ATUAL - Verificar no fusohorário do server
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          include: {
            model: Servico,
            where: {
              id_veiculo: veiculo.id,
            },
            attributes: ['id'],
          },
          attributes: ['id', 'quilometragem', 'descricao', 'momento'],
        })
          .then(revisoes => {
            return res.status(HttpStatus.OK).json(revisoes);
          })
          .catch(err => {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              mensagem: 'Erro interno no servidor',
            });
          });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: 'Veiculo não encontrado',
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro interno no servidor',
      });
    });
};

exports.salvar = async (req, res) => {
  const {
    nome,
    placa,
    renavam,
    marca,
    modelo,
    quilometragem,
    cnh_requerida,
  } = req.body;

  const salvar = {
    nome,
    placa,
    renavam,
    marca,
    modelo,
    quilometragem,
    cnh_requerida,
  };

  const errors = [];

  if (!nome || nome.toString().trim().length === 0) {
    errors.push('O nome é obrigatório');
  }

  if (!placa || placa.toString().trim().length === 0) {
    errors.push('A placa é obrigatória');
  } else {
    const veiculo = await Veiculo.findAll({
      where: { placa },
    });
    if (veiculo.length > 0) {
      errors.push('A placa informada já está cadastrada');
    } else {
      salvar.placa = placa.toUpperCase();
    }
  }

  if (!renavam || renavam.toString().trim().length === 0) {
    errors.push('O número do renavam é obrigatório');
  }

  if (!marca || marca.toString().trim().length === 0) {
    errors.push('A marca é obrigatória');
  }

  if (!modelo || modelo.toString().trim().length === 0) {
    errors.push('O modelo é obrigatório');
  }

  if (!quilometragem) {
    delete salvar.quilometragem;
  } else {
    if (isNaN(quilometragem))
      errors.push('O valor da quilometragem é inválido');
  }

  if (!cnh_requerida) {
    errors.push('A CNH requerida é obrigatória');
  } else {
    const cat = cnh_requerida.toUpperCase();
    if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat))
      errors.push(
        'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]',
      );
    salvar.cnh_requerida = cat;
  }

  if (errors.length > 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Parâmetro(s) inválido(s)',
      errors,
    });
  }

  Veiculo.create(salvar)
    .then(veiculo => {
      res.status(HttpStatus.CREATED).json(veiculo.dataValues);
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    });
};

exports.editar = async (req, res, next) => {
  const id = req.params.veiculoId;
  const {
    nome,
    placa,
    renavam,
    marca,
    modelo,
    quilometragem,
    cnh_requerida,
  } = req.body;
  const errors = [];

  const veiculoBD = await Veiculo.findByPk(id);
  if (!veiculoBD) errors.push('Veículo não encontrado');

  const salvar = {
    nome,
    placa,
    renavam,
    marca,
    modelo,
    quilometragem,
    cnh_requerida,
  };

  if (nome) {
    if (nome.toString().trim().length === 0) {
      errors.push('Nome inválido');
    }
  } else {
    delete salvar.nome;
  }

  if (placa) {
    if (placa.toString().trim().length === 0) {
      errors.push('Placa inválida');
    } else {
      const veiculo = await Veiculo.findAll({
        where: { placa },
      });
      if (veiculo.length > 0)
        if (veiculo[0].id != id)
          errors.push('A placa informada já está cadastrada');
    }
  } else {
    delete salvar.placa;
  }

  if (renavam) {
    if (renavam.toString().trim().length === 0) {
      errors.push('Renavam inválido');
    }
  } else {
    delete salvar.renavam;
  }

  if (marca) {
    if (marca.toString().trim().length === 0) {
      errors.push('Marca inválida');
    }
  } else {
    delete salvar.marca;
  }

  if (modelo) {
    if (modelo.toString().trim().length === 0) {
      errors.push('Modelo inválido');
    }
  } else {
    delete salvar.modelo;
  }

  if (quilometragem) {
    if (isNaN(quilometragem))
      errors.push('O valor da quilometragem é inválido');
  } else {
    delete salvar.quilometragem;
  }

  if (cnh_requerida) {
    const cat = cnh_requerida.toUpperCase();
    if (!['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].includes(cat))
      errors.push(
        'Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]',
      );
    salvar.cnh_requerida = cat;
  } else {
    delete salvar.cnh_requerida;
  }

  if (errors.length > 0)
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Parâmetro(s) inválido(s)',
      errors,
    });

  Veiculo.update(salvar, {
    where: { id },
  })
    .then(() => {
      Veiculo.findByPk(id)
        .then(veiculo => {
          res.status(HttpStatus.OK).json(veiculo.dataValues);
        })
        .catch(err => {
          console.log(err);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: 'Erro interno do servidor',
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro interno do servidor',
      });
    });
};

exports.deletar = (req, res, next) => {
  const id = req.params.veiculoId;

  Veiculo.destroy({
    where: { id },
  })
    .then(() => {
      res.status(HttpStatus.NO_CONTENT).send();
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    });
};
