const HttpStatus = require("http-status-codes");
const Veiculo = require("../models").veiculo;
const Servico = require("../models").servico;
const Revisao = require("../models").servico_revisao;

const validar_data = require("../utils");

exports.get = (req, res) => {
  const veiculoId = req.params.veiculoId;

  Servico.findAll({
    where: {
      id_veiculo: veiculoId,
    },
  })
    .then((servicos) => {
      return res.status(HttpStatus.OK).json(servicos);
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: "Erro interno no servidor",
      });
    });
};

exports.get_by_id = (req, res) => {
  const { veiculoId, servicoId } = req.params;

  Servico.findAll({
    where: {
      id: servicoId,
      id_veiculo: veiculoId,
    },
  })
    .then((response) => {
      if (response.length !== 0) {
        const servico = response[0].dataValues;

        Revisao.findAll({
          where: {
            id_servico: servico.id,
          },
        })
          .then((revisoes) => {
            if (revisoes.length !== 0) {
              const revisao = revisoes[0].dataValues;
              delete revisao.id_servico;

              const newService = Object.assign({}, servico, {
                revisao,
              });
              return res.status(HttpStatus.OK).json(newService);
            } else {
              // Sem revisões
              return res.status(HttpStatus.OK).json(servico);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(HttpStatus.OK).json(servico);
          });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: "Serviço não encontrado",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: "Erro interno no servidor",
      });
    });
};

exports.save = async (req, res) => {
  const veiculo = req.params.veiculoId;
  const { quilometragem, descricao, revisao } = req.body;

  if (veiculo) {
    const veiculoBD = await Veiculo.findByPk(veiculo);

    if (!veiculoBD)
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "Veículo inexistente",
      });
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "O veículo é obrigatório",
    });
  }

  if (quilometragem) {
    if (isNaN(quilometragem)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "O valor da quilometragem é inválido",
      });
    }
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "A quilometragem é obrigatória",
    });
  }

  if (descricao) {
    if (descricao.toString().trim().length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "A descrição é obrigatória",
      });
    }
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "A descrição é obrigatória",
    });
  }

  if (revisao) {
    if (revisao.descricao) {
      if (revisao.descricao.toString().trim().length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "Informe uma descrição para a revisão",
        });
      }
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "A descrição da revisão é obrigatória",
      });
    }

    if (!revisao.momento && !revisao.quilometragem) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "A quilometragem ou momento deve ser informado",
      });
    }

    if (revisao.quilometragem) {
      if (isNaN(revisao.quilometragem)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "A quilometragem da revisão é inválida",
        });
      }
    }

    if (revisao.momento) {
      if (!validar_data(revisao.momento)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "O momento da revisão é inválido",
        });
      }
    }
  }

  const salvar = {
    quilometragem,
    descricao,
    momento: new Date(),
    id_veiculo: veiculo,
    id_responsavel: req.userData.id,
  };

  Servico.create(salvar)
    .then((servico) => {
      if (revisao) {
        return save_revisao(res, servico, revisao);
      } else {
        return res.status(HttpStatus.CREATED).json(servico);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: err,
      });
    });
};

const save_revisao = (res, servico, revisao) => {
  const { quilometragem, momento, descricao } = revisao;
  const id_servico = servico.id;

  const salvar = {
    quilometragem,
    momento,
    descricao,
    id_servico,
  };

  Revisao.create(salvar)
    .then((response) => {
      delete response.dataValues.id_servico;
      const servicoRevisao = Object.assign({}, servico.dataValues, {
        revisao: response.dataValues,
      });
      return res.status(HttpStatus.CREATED).json(servicoRevisao);
    })
    .catch(() => {
      return res.status(HttpStatus.CREATED).json(servico);
    });
};

exports.edit = (req, res) => {
  const { servicoId, revisaoId } = req.params;

  // alterar REALIZADA em revisao para TRUE
  Revisao.update(
    { realizada: true },
    {
      where: {
        id: revisaoId,
        id_servico: servicoId,
      },
    }
  )
    .then(async (response) => {
      // criar serviço com os novos dados da revisão
      const { quilometragem, descricao, revisao } = req.body;
      const errors = [];

      const servico = await Servico.findByPk(servicoId);

      const id_veiculo = servico.id_veiculo;

      if (quilometragem) {
        if (isNaN(quilometragem)) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: "O valor da quilometragem é inválido",
          });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "A quilometragem é obrigatória",
        });
      }

      if (descricao) {
        if (descricao.toString().trim().length === 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: "A descrição é obrigatória",
          });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "A descrição é obrigatória",
        });
      }

      if (revisao) {
        if (revisao.descricao) {
          if (revisao.descricao.toString().trim().length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              mensagem: "Informe uma descrição para a revisão",
            });
          }
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: "A descrição da revisão é obrigatória",
          });
        }

        if (!revisao.momento && !revisao.quilometragem) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: "A quilometragem ou momento deve ser informado",
          });
        }

        if (revisao.quilometragem) {
          if (isNaN(revisao.quilometragem)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              mensagem: "A quilometragem da revisão é inválida",
            });
          }
        }

        if (revisao.momento) {
          if (!validar_data(revisao.momento)) {
            // Não pode ser uma data já passada
            return res.status(HttpStatus.BAD_REQUEST).json({
              mensagem: "O momento da revisão é inválido",
            });
          }
        }
      }

      const salvar = {
        quilometragem,
        descricao,
        momento: new Date(),
        id_veiculo,
        id_responsavel: req.userData.id,
      };

      Servico.create(salvar)
        .then((servico) => {
          if (revisao) {
            // se foi enviado uma revisao, crio uma nova
            return save_revisao(res, servico, revisao);
          } else {
            return res.status(HttpStatus.CREATED).json(servico);
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(HttpStatus.BAD_REQUEST).json({
            mensagem: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    });
};

exports.delete = async (req, res) => {
  const { veiculoId, servicoId } = req.params;

  Servico.destroy({
    where: {
      id: servicoId,
      id_veiculo: veiculoId,
    },
  })
    .then(() => {
      res.status(HttpStatus.NO_CONTENT).send();
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    });
};
