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

  if (quantidade) {
    if (isNaN(quantidade)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "O valor da quantidade é inválido",
      });
    }
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "A quantidade é obrigatória",
    });
  }

  // Validar tipos [gasolina, diesel...]
  if (tipo) {
    if (tipo.trim().length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: "Tipo de combustível inválido",
      });
    }
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "Tipo de combustível é obrigatório",
    });
  }

  const salvar = {
    quilometragem,
    quantidade,
    tipo,
    momento: new Date(),
    id_veiculo: veiculo,
    id_responsavel: req.userData.id,
  };

  Abastecimento.create(salvar)
    .then((abastecimento) => {
      return res.status(HttpStatus.CREATED).json(abastecimento);
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
