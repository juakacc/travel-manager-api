const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const Motorista = require('../models').motorista;
const Permissao = require("../models").auth_permissoes;
const Papel = require("../models").auth_papeis;
const constantes = require("../constantes");

const check = async (req, res, next, role) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodificado = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    const id_motorista = decodificado.id;

    Motorista.findByPk(id_motorista, {
      attributes: ['id', 'ativo']
    })
      .then(motorista => {
        if (!motorista.dataValues.ativo) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            mensagem:
              "Você não tem permissão para realizar essa ação, contate o administrador!",
            tokenExpirado: false,
          });
        } else {
          Permissao.findAll({
            where: { id_motorista },
            include: [Papel],
          })
            .then((p) => {
              const permissoes = p.map((item) => {
                return item.dataValues.auth_papei.dataValues.nome;
              });
              if (permissoes.length == 0) {
                permissoes.push(constantes.MOTORISTA);
              }
              
              if (
                permissoes.includes(role) ||
                permissoes.includes(constantes.ADMIN)
              ) {
                // ADMIN > MOTORISTA
                req.userData = decodificado;
                req.userData.roles = permissoes; // adicionando roles na requisição
                next();
              } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                  mensagem:
                    "Você não tem permissão para realizar essa ação, contate o administrador!",
                  tokenExpirado: false,
                });
              }
            })
            .catch((erro) => {
              console.error(erro);
              return res.status(HttpStatus.UNAUTHORIZED).json({
                mensagem: "Erro na validação",
                tokenExpirado: false
              });
            });
        }
      })
      .catch(erro => {
        console.error(erro);
        return res.status(HttpStatus.UNAUTHORIZED).json({
          mensagem: "Erro na validação",
          tokenExpirado: false
        });
      })
  } catch (erro) {
    const tokenExpirado = erro.name === "TokenExpiredError";

    return res.status(HttpStatus.UNAUTHORIZED).json({
      mensagem: "Sem permissão para acesso",
      tokenExpirado,
      erro,
    });
  }
};

module.exports = check;
