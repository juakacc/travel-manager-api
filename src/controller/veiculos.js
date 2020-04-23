const express = require("express");
const check_auth = require("../middleware/check_auth");
const veiculos = require("../service/veiculos");
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
 * @api {get} /veiculos Retorna uma lista com os veículos
 * @apiName getVeiculos
 * @apiGroup Veiculos
 *
 * @apiUse Header
 *
 * @apiSuccess {Object[]} veiculo               Veículos cadastrados.
 * @apiSuccess {Number}   veiculo.id            ID do veiculo.
 * @apiSuccess {String}   veiculo.nome          Nome do veiculo.
 * @apiSuccess {String}   veiculo.placa         Placa do veiculo.
 * @apiSuccess {String}   veiculo.renavam       Renavam do veiculo.
 * @apiSuccess {String}   veiculo.marca         Marca do veiculo.
 * @apiSuccess {String}   veiculo.modelo        Modelo do veiculo.
 * @apiSuccess {Number}   veiculo.quilometragem Quilometragem atual do veiculo.
 * @apiSuccess {Boolean}  veiculo.disponivel    <code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.
 * @apiSuccess {String}   veiculo.cnh_requerida CNH requerida para conduzir o veiculo.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "nome": "MOTO",
 *      "placa": "KDJ2929",
 *      "renavam": "123123454",
 *      "marca": "Honda",
 *      "modelo": "Fan",
 *      "quilometragem": 200,
 *      "disponivel": false,
 *      "cnh_requerida": "A"
 *    }, {
 *      "id": 2,
 *      "nome": "GOL02",
 *      "placa": "QGG3322",
 *      "renavam": "156987965",
 *      "marca": "Volks",
 *      "modelo": "Gol",
 *      "quilometragem": 11200,
 *      "disponivel": true,
 *      "cnh_requerida": "B"
 *    }]
 */
router.get(
  "/",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  veiculos.get_all
);

/**
 * @api {get} /veiculos/disponiveis Retorna uma lista com os veículos disponíveis para viagem
 * @apiName getVeiculosDisponiveis
 * @apiGroup Veiculos
 *
 * @apiUse Header
 *
 * @apiSuccess {Object[]} veiculo               Veículos cadastrados.
 * @apiSuccess {Number}   veiculo.id            ID do veiculo.
 * @apiSuccess {String}   veiculo.nome          Nome do veiculo.
 * @apiSuccess {String}   veiculo.placa         Placa do veiculo.
 * @apiSuccess {String}   veiculo.renavam       Renavam do veiculo.
 * @apiSuccess {String}   veiculo.marca         Marca do veiculo.
 * @apiSuccess {String}   veiculo.modelo        Modelo do veiculo.
 * @apiSuccess {Number}   veiculo.quilometragem Quilometragem atual do veiculo.
 * @apiSuccess {Boolean}  veiculo.disponivel    <code>True</code> (veículos disponíveis)
 * @apiSuccess {String}   veiculo.cnh_requerida CNH requerida para conduzir o veiculo.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 2,
 *      "nome": "GOL02",
 *      "placa": "QGG3322",
 *      "renavam": "156987965",
 *      "marca": "Volks",
 *      "modelo": "Gol",
 *      "quilometragem": 11200,
 *      "disponivel": true,
 *      "cnh_requerida": "B"
 *    }]
 */
router.get(
  "/disponiveis",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  veiculos.get_disponiveis
);

/**
 * @api {get} /veiculos/:veiculoId Retorna um veículo específico
 * @apiName getVeiculo
 * @apiGroup Veiculos
 *
 * @apiUse Header
 *
 * @apiParam {Number} veiculoId ID do veículo a ser buscado
 *
 * @apiSuccess {Number}  id            ID do veiculo.
 * @apiSuccess {String}  nome          Nome do veiculo.
 * @apiSuccess {String}  placa         Placa do veiculo.
 * @apiSuccess {String}  renavam       Renavam do veiculo.
 * @apiSuccess {String}  marca         Marca do veiculo.
 * @apiSuccess {String}  modelo        Modelo do veiculo.
 * @apiSuccess {Number}  quilometragem Quilometragem atual do veiculo.
 * @apiSuccess {Boolean} disponivel    <code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.
 * @apiSuccess {String}  cnh_requerida CNH requerida para conduzir o veiculo.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "nome": "GOL02",
 *      "placa": "QGG3322",
 *      "renavam": "156987965",
 *      "marca": "Volks",
 *      "modelo": "Gol",
 *      "quilometragem": 11200,
 *      "disponivel": true,
 *      "cnh_requerida": "B"
 *    }
 *
 * @apiError VeiculoNotFound O <code>id</code> do veículo não foi encontrado.
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "mensagem": "Veículo não encontrado",
 *    }
 */
router.get(
  "/:veiculoId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  veiculos.get_by_id
);

/**
 * @api {post} /veiculos Cadastra um novo Veículo
 * @apiName saveVeiculo
 * @apiGroup Veiculos
 * @apiPermission admin
 *
 * @apiUse Header
 *
 * @apiParam {String}                                         nome              Nome do veiculo.
 * @apiParam {String}                                         placa             Placa do veiculo.
 * @apiParam {String}                                         renavam           Renavam do veiculo.
 * @apiParam {String}                                         marca             Marca do veiculo.
 * @apiParam {String}                                         modelo            Modelo do veiculo.
 * @apiParam {Number}                                         [quilometragem=0] Quilometragem atual do veiculo.
 * @apiParam {String="A","B","C","D","E","AB","AC","AD","AE"} cnh_requerida     CNH requerida para conduzir o veiculo.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "nome": "GOL-02",
 *        "placa": "QFF-3032",
 *        "renavam": "123456",
 *        "marca": "Volkswagem",
 *        "modelo": "Gol",
 *      	"quilometragem": 3000,
 *        "cnh_requerida": "B"
 *     }
 *
 * @apiSuccess {Number}  id            ID do veiculo.
 * @apiSuccess {String}  nome          Nome do veiculo.
 * @apiSuccess {String}  placa         Placa do veiculo.
 * @apiSuccess {String}  renavam       Renavam do veiculo.
 * @apiSuccess {String}  marca         Marca do veiculo.
 * @apiSuccess {String}  modelo        Modelo do veiculo.
 * @apiSuccess {Number}  quilometragem Quilometragem atual do veiculo.
 * @apiSuccess {Boolean} disponivel    <code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.
 * @apiSuccess {String}  cnh_requerida CNH requerida para conduzir o veiculo.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 1,
 *      "nome": "GOL-02",
 *      "placa": "QFF-3032",
 *      "renavam": "123456",
 *      "marca": "Volkswagem",
 *      "modelo": "Gol",
 *    	"quilometragem": 3000,
 *      "cnh_requerida": "B"
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
  veiculos.salvar
);

/**
 * @api {put} /veiculos/:veiculoId Atualiza um Veículo
 * @apiName updateVeiculo
 * @apiGroup Veiculos
 * @apiPermission admin
 *
 * @apiUse Header
 *
 * @apiParam  {Number} veiculoId Id do veículo
 *
 * @apiParam {String}                                         [nome]          Nome do veiculo.
 * @apiParam {String}                                         [placa]         Placa do veiculo.
 * @apiParam {String}                                         [renavam]       Renavam do veiculo.
 * @apiParam {String}                                         [marca]         Marca do veiculo.
 * @apiParam {String}                                         [modelo]        Modelo do veiculo.
 * @apiParam {Number}                                         [quilometragem] Quilometragem atual do veiculo.
 * @apiParam {String="A","B","C","D","E","AB","AC","AD","AE"} [cnh_requerida] CNH requerida para conduzir o veiculo.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "nome": "GOL-02",
 *        "placa": "QFF-3032",
 *        "renavam": "123456",
 *        "marca": "Volkswagem",
 *        "modelo": "Gol",
 *      	"quilometragem": 3000,
 *        "cnh_requerida": "B"
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
 *      "nome": "GOL-02",
 *      "placa": "QFF-3032",
 *      "renavam": "123456",
 *      "marca": "Volkswagem",
 *      "modelo": "Gol",
 *      "quilometragem": 3000,
 *      "disponivel": true,
 *      "cnh_requerida": "B"
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Veiculo não encontrado",
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 */
router.put(
  "/:veiculoId",
  (req, res, next) => check_auth(req, res, next, constantes.ADMIN),
  veiculos.editar
);

/**
 * @api {delete} /veiculos/:veiculoId Deleta um Veículo
 * @apiName deleteVeiculo
 * @apiGroup Veiculos
 * @apiPermission admin
 *
 * @apiParam {Number} veiculoId ID do veículo
 *
 * @apiUse Header
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No Content
 */
router.delete(
  "/:veiculoId",
  (req, res, next) => check_auth(req, res, next, constantes.ADMIN),
  veiculos.deletar
);

module.exports = router;
