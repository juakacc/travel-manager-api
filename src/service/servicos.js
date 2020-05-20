const HttpStatus = require("http-status-codes");
const Veiculo = require("../models").veiculo;
const Servico = require("../models").servico;
const Revisao = require("../models").servico_revisao;
const ADMIN = require("../constantes").ADMIN;

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
  const id = req.params.servicoId;

  Servico.findByPk(id)
    .then((response) => {
      if (!response) {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: "Serviço não encontrado",
        });
      } else {
        const servico = response.dataValues;

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

  if (quilometragem) {
    if (isNaN(quilometragem)) {
      return res.status(HttpStatus.CREATED).json(servico);
    }
  } else {
    return res.status(HttpStatus.CREATED).json(servico);
  }

  if (descricao) {
    if (descricao.toString().trim().length === 0) {
      return res.status(HttpStatus.CREATED).json(servico);
    }
  } else {
    return res.status(HttpStatus.CREATED).json(servico);
  }

  if (!validar_data(momento)) {
    return res.status(HttpStatus.CREATED).json(servico);
  }

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

exports.delete = async (req, res) => {
  const id = req.params.servicoId;

  const servicoBD = await Servico.findByPk(id);

  if (servicoBD) {
    if (
      servicoBD.dataValues.id_responsavel !== req.userData.id &&
      !req.userData.roles.includes(ADMIN)
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        mensagem: "Sem permissão para realizar essa ação",
      });
    } else {
      Servico.destroy({
        where: { id },
      })
        .then(() => {
          res.status(HttpStatus.NO_CONTENT).send();
        })
        .catch((err) => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            mensagem: err,
          });
        });
    }
  } else {
    return res.status(HttpStatus.NOT_FOUND).json({
      mensagem: "Servico não encontrado",
    });
  }
};
