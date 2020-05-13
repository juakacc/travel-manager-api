const HttpStatus = require("http-status-codes");
const Veiculo = require("../models").veiculo;
const Abastecimento = require("../models").abastecimento;
const ADMIN = require("../constantes").ADMIN;

exports.get = (req, res) => {
  Abastecimento.findAll()
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
  const id = req.params.abastecimentoId;

  Abastecimento.findByPk(id)
    .then((abastecimento) => {
      if (!abastecimento) {
        return res.status(HttpStatus.NOT_FOUND).json({
          mensagem: "Abastecimento não encontrado",
        });
      } else {
        return res.status(HttpStatus.OK).json(abastecimento.dataValues);
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
  const { quilometragem, quantidade, tipo, veiculo } = req.body;

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

  if (isNaN(quilometragem)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "O valor da quilometragem é inválido",
    });
  }

  if (isNaN(quantidade)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "O valor da quantidade é inválido",
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
  const id = req.params.abastecimentoId;

  const abastecimentoBD = await Abastecimento.findByPk(id);

  if (abastecimentoBD) {
    if (
      abastecimentoBD.dataValues.id_responsavel !== req.userData.id &&
      !req.userData.roles.includes(ADMIN)
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        mensagem: "Sem permissão para realizar essa ação",
      });
    } else {
      Abastecimento.destroy({
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
      mensagem: "Abastecimento não encontrado",
    });
  }
};
