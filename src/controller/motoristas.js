const express = require("express");
const check_auth = require("../middleware/check_auth");
const motoristas = require("../service/motoristas");
const constantes = require("../constantes");
const router = express.Router();

/**
 * @apiDefine Header
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer TOKEN"
 *     }
 */

/**
 * @api {get} /motoristas Retorna uma lista com os Motoristas
 * @apiName getMotoristas
 * @apiGroup Motoristas
 *
 * @apiUse Header
 *
 * @apiSuccess {Object[]} mostorista           Motoristas cadastrados.
 * @apiSuccess {Number}   motorista.id         ID do motorista.
 * @apiSuccess {String}   motorista.nome       Nome do motorista.
 * @apiSuccess {String}   motorista.apelido    Nome do motorista.
 * @apiSuccess {String}   motorista.cnh        Número da CNH do motorista.
 * @apiSuccess {String}   motorista.categoria  Categoria da CNH do motorista.
 * @apiSuccess {String}   motorista.telefone   Telefone do motorista.
 * @apiSuccess {Boolean}  motorista.disponivel <code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "nome": "João",
 *      "apelido": "joao",
 *      "cnh": "12345",
 *      "categoria": "AB",
 *      "telefone": "999999999",
 *      "disponivel": true
 *    }, {
 *      "id": 2,
 *      "nome": "Maria",
 *      "apelido": "maria",
 *      "cnh": "54321",
 *      "categoria": "B",
 *      "telefone": "999999999",
 *      "disponivel": false
 *    }]
 */
router.get(
  "/",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  motoristas.get_all
);

/**
 * @api {get} /motoristas/:motoristaId Retorna um Motorista específico
 * @apiName getMotorista
 * @apiGroup Motoristas
 *
 * @apiParam  {Number} motoristaId Id do motorista
 *
 * @apiUse Header
 *
 * @apiSuccess {Number}   id         ID do motorista.
 * @apiSuccess {String}   nome       Nome do motorista.
 * @apiSuccess {String}   apelido    Nome do motorista.
 * @apiSuccess {String}   cnh        Número da CNH do motorista.
 * @apiSuccess {String}   categoria  Categoria da CNH do motorista.
 * @apiSuccess {String}   telefone   Telefone do motorista.
 * @apiSuccess {Boolean}  disponivel <code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.
 * @apiSuccess {String[]} permissoes Permissões do motorista.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "nome": "João",
 *      "apelido": "joao",
 *      "cnh": "12345",
 *      "categoria": "AB",
 *      "telefone": "999999999",
 *      "disponivel": true,
 *      "permissoes": [
 *        "motorista",
 *        "admin"
 *      ]
 *    }
 *
 * @apiError MotoristaNotFound O <code>id</code> do motorista não foi encontrado.
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "mensagem": "Motorista não encontrado",
 *    }
 */
router.get(
  "/:motoristaId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  motoristas.get_by_id
);

/**
 * @api {post} /motoristas Cadastra um Motorista
 * @apiName saveMotorista
 * @apiGroup Motoristas
 *
 * @apiUse Header
 *
 * @apiParam {String}                                         nome                             Nome do motorista.
 * @apiParam {String}                                         apelido                          Apelido do motorista.
 * @apiParam {String}                                         cnh                              Número da CNH do motorista.
 * @apiParam {String="A","B","C","D","E","AB","AC","AD","AE"} categoria                        Categoria da CNH do motorista.
 * @apiParam {String}                                         telefone                         Telefone do motorista.
 * @apiParam {String}                                         senha                            Senha do motorista.
 * @apiParam {Object}                                         [permissoes="{motorista: true}"] Permissões do motorista
 * @apiParam {Boolean}                                        [permissoes[motorista]]          Permissão de motorista
 * @apiParam {Boolean}                                        [permissoes[admin]]              Permissão de administrador
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "nome": "João Costa",
 *       "apelido": "joao123",
 *       "cnh": "12345",
 *       "categoria": "AC",
 *       "telefone": "999999999",
 *       "senha": "acasdoasdnk",
 *       "permissoes": {
 *          "motorista": true,
 *          "admin": true,
 *       }
 *     }
 *
 * @apiSuccess {Number}  id         ID do motorista.
 * @apiSuccess {String}  nome       Nome do motorista.
 * @apiSuccess {String}  apelido    Nome do motorista.
 * @apiSuccess {String}  cnh        Número da CNH do motorista.
 * @apiSuccess {String}  categoria  Categoria da CNH do motorista.
 * @apiSuccess {String}  telefone   Telefone do motorista.
 * @apiSuccess {Boolean} disponivel <code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 1,
 *      "nome": "João",
 *      "apelido": "joao",
 *      "cnh": "12345",
 *      "categoria": "AB",
 *      "telefone": "999999999",
 *      "disponivel": true
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 */
router.post(
  "/",
  (req, res, next) => check_auth(req, res, next, constantes.ADMIN),
  motoristas.salvar
);

/**
 * @api {put} /motoristas/:motoristaId Atualiza um Motorista
 * @apiName updateMotorista
 * @apiGroup Motoristas
 *
 * @apiUse Header
 *
 * @apiParam  {Number} motoristaId Id do motorista
 *
 * @apiParam {String}                                         [nome]      Nome do motorista.
 * @apiParam {String}                                         [apelido]   Apelido do motorista.
 * @apiParam {String}                                         [cnh]       Número da CNH do motorista.
 * @apiParam {String="A","B","C","D","E","AB","AC","AD","AE"} [categoria] Categoria da CNH do motorista.
 * @apiParam {String}                                         [telefone]  Telefone do motorista.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "nome": "João Costa",
 *       "apelido": "joao123",
 *       "cnh": "12345",
 *       "categoria": "AC",
 *       "telefone": "999999999"
 *     }
 *
 * @apiSuccess {Number}  id         ID do motorista.
 * @apiSuccess {String}  nome       Nome do motorista.
 * @apiSuccess {String}  apelido    Nome do motorista.
 * @apiSuccess {String}  cnh        Número da CNH do motorista.
 * @apiSuccess {String}  categoria  Categoria da CNH do motorista.
 * @apiSuccess {String}  telefone   Telefone do motorista.
 * @apiSuccess {Boolean} disponivel <code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "nome": "João",
 *      "apelido": "joao",
 *      "cnh": "12345",
 *      "categoria": "AB",
 *      "telefone": "999999999",
 *      "disponivel": true
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Motorista não encontrado",
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 */
router.put(
  "/:motoristaId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  motoristas.editar
);

/**
 * @api {delete} /motoristas/:motoristaId Deleta um Motorista
 * @apiName deleteMotorista
 * @apiGroup Motoristas
 *
 * @apiParam {Number} motoristaId Id do motorista
 *
 * @apiUse Header
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No Content
 */
router.delete(
  "/:motoristaId",
  (req, res, next) => check_auth(req, res, next, constantes.ADMIN),
  motoristas.deletar
);

module.exports = router;
