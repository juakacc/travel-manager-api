const moment = require("moment");
const HttpStatus = require("http-status-codes");

const Veiculo = require("../models").veiculo;
const Abastecimento = require("../models").abastecimento;

exports.get = (req, res) => {
  const { veiculoId } = req.params;

  Abastecimento.findAll({
    where: {
      id_veiculo: veiculoId,
    },
  })
    .then((abastecimentos) => {
      return res.status(HttpStatus.OK).json(abastecimentos);
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: "Erro interno no servidor",
      });
    });
};

exports.get_by_id = (req, res) => {
  const { veiculoId, abastecimentoId } = req.params;

  Abastecimento.findAll({
    where: {
      id: abastecimentoId,
      id_veiculo: veiculoId,
    },
  })
    .then((abastecimentos) => {
      if (abastecimentos.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: "Abastecimento não encontrado",
        });
      } else {
        return res.status(HttpStatus.OK).json(abastecimentos[0].dataValues);
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
  const { quilometragem, quantidade, tipo } = req.body;
  let update_km = false;
  const errors = [];

  if (veiculo) {
    const veiculoBD = await Veiculo.findByPk(veiculo);

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

  if (isNaN(quantidade) || parseFloat(quantidade) === 0) {
    errors.push("O valor da quantidade é inválido");
  }

  // Validar tipos [gasolina, diesel...]
  if (!tipo || tipo.toString().trim().length === 0) {
    errors.push("Tipo de combustível inválido");
  }

  if (errors.length > 0)
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "Parâmetro(s) inválido(s)",
      errors,
    });

  const momento = moment().utcOffset(-180).format("YYYY-MM-DD HH:mm:ss");

  const salvar = {
    quilometragem,
    quantidade,
    tipo,
    momento,
    id_veiculo: veiculo,
    id_responsavel: req.userData.id,
  };

  Abastecimento.create(salvar)
    .then((abastecimento) => {
      if (update_km) {
        Veiculo.update(
          { quilometragem },
          {
            where: {
              id: veiculo,
            },
          }
        )
          .then(() => {
            return res.status(HttpStatus.CREATED).json(abastecimento);
          })
          .catch(() => {
            return res.status(HttpStatus.CREATED).json(abastecimento);
          });
      } else {
        return res.status(HttpStatus.CREATED).json(abastecimento);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: err,
      });
    });
};

exports.delete = async (req, res) => {
  const { veiculoId, abastecimentoId } = req.params;

  Abastecimento.destroy({
    where: {
      id: abastecimentoId,
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
