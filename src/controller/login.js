const express = require("express");
const HttpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const check_auth = require("../middleware/check_auth");
const constantes = require("../constantes");
const Motorista = require("../models").motorista;
const UserTokenFCM = require("../models").user_tokenfcm;

const router = express.Router();

/**
 * @api {post} /login Autenticar-se na aplicação
 * @apiName login
 * @apiGroup Login
 *
 * @apiParam {String} apelido Apelido do motorista.
 * @apiParam {String} senha   Senha do motorista.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "apelido": "joao123",
 *       "senha": "adfasdf",
 *     }
 *
 * @apiSuccess {Number} id    ID do motorista.
 * @apiSuccess {String} token Token JWT de autenticação.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "token": "TOKEN_JWT"
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Login e senha não correspondem",
 *    }
 */
router.post("/", (req, res, next) => {
  const { apelido, senha } = req.body;

  if (!apelido) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "Apelido é obrigatório",
    });
  }

  if (!senha) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: "Senha é obrigatória",
    });
  }

  Motorista.findAll({
    where: { apelido },
  })
    .then((motoristas) => {
      if (motoristas.length < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "Apelido inválido",
        });
      }
      const motorista = motoristas[0].dataValues;

      if (!bcrypt.compareSync(senha, motorista.senha)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mensagem: "Login e senha não correspondem",
        });
      }

      const token = jwt.sign(
        {
          id: motorista.id,
          apelido: motorista.apelido,
        },
        process.env.SECRET_KEY_TOKEN
        // {
        //   expiresIn: "30days",
        //   // expiresIn: '1min'
        // }
      );

      return res.status(HttpStatus.OK).json({
        id: motorista.id,
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    });
});

const saveToken = async (req, res, next) => {

  const jaExiste = await UserTokenFCM.findOne({
    token: req.body.token,
    id_user: req.userData.id
  })

  if (!jaExiste) {
    UserTokenFCM.create({
      token: req.body.token,
      id_user: req.userData.id
    })
    .then(savedToken => {
      return res.status(HttpStatus.OK).json(savedToken.dataValues);
    })
    .catch(err => {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensagem: err,
      });
    })
  } else {
    return res.status(HttpStatus.BAD_REQUEST).json({
      mensagem: 'Token já persistido pelo sistema!'
    });
  }
}

router.post('/save-token/', 
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA), 
  saveToken);

module.exports = router;
