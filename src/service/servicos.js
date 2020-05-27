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

exports.save = (req, res) => {
  const veiculo = req.params.veiculoId;
  const { quilometragem, descricao, revisao } = req.body;

  return save_servico(req, res, veiculo, {
    quilometragem,
    descricao,
    revisao,
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
    .then(async () => {
      // criar serviço com os novos dados da revisão
      const { quilometragem, descricao, revisao } = req.body;

      const servico = await Servico.findByPk(servicoId);
      const id_veiculo = servico.id_veiculo;

      return save_servico(req, res, id_veiculo, {
        quilometragem,
        descricao,
        revisao,
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

const save_servico = async (req, res, id_veiculo, servico) => {
  const { quilometragem, descricao, revisao } = servico;
  let update_km = false;
  const errors = [];

  if (id_veiculo) {
    const veiculoBD = await Veiculo.findByPk(id_veiculo);

    if (!veiculoBD) {
      errors.push("Veículo inexistente");
    } else {
      if (veiculoBD.quilometragem < quilometragem) update_km = true;
    }
  } else {
    errors.push("O veículo é obrigatório");
  }

  if (isNaN(quilometragem) || quilometragem == 0) {
    errors.push("O valor da quilometragem é inválido");
  }

  if (!descricao || descricao.toString().trim().length === 0) {
    errors.push("A descrição é obrigatória");
  }

  if (revisao) {
    errors.push(...validar_revisao(revisao, quilometragem));
  }

  if (errors.length > 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "Parâmetro(s) inválido(s)",
      errors,
    });
  }

  Servico.create({
    quilometragem,
    descricao,
    momento: new Date(), // Validar fuso of server
    id_veiculo,
    id_responsavel: req.userData.id,
  })
    .then((servico) => {
      if (update_km) {
        Veiculo.update(
          { quilometragem },
          {
            where: {
              id: id_veiculo,
            },
          }
        )
          .then(() => finish_save(res, servico, revisao))
          .catch(() => finish_save(res, servico, revisao));
      } else {
        return finish_save(res, servico, revisao);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: err,
      });
    });
};

const finish_save = (res, servico, revisao) => {
  if (revisao) {
    return save_revisao(res, servico, revisao);
  } else {
    return res.status(HttpStatus.CREATED).json(servico);
  }
};

const save_revisao = (res, servico, revisao) => {
  const { quilometragem, momento, descricao } = revisao;
  const id_servico = servico.id; // Dados já chegam aqui validados

  Revisao.create({
    quilometragem,
    momento,
    descricao,
    id_servico,
  })
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

const validar_revisao = (revisao, quilometragem) => {
  const errors = [];
  const { descricao: d, momento: m, quilometragem: q } = revisao;

  if (!d || d.toString().trim().length === 0) {
    errors.push("Informe uma descrição para a revisão");
  }

  if (!m && !q) {
    errors.push("A quilometragem ou momento deve ser informado");
  }

  if (q) {
    if (isNaN(q)) {
      errors.push("A quilometragem da revisão é inválida");
    } else {
      if (q <= quilometragem)
        errors.push("Quilometragem da revisão anterior a do serviço");
    }
  }

  if (m && !validar_data(m)) {
    errors.push("O momento da revisão é inválido");
  }
  return errors;
};
