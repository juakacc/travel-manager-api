const express = require("express");
const check_auth = require("../middleware/check_auth");
const viagens = require("../service/viagens");
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
 * @apiDefine Veiculo
 * @apiSuccess {Object}  veiculo               Veículo que realizou a viagem
 * @apiSuccess {Number}  veiculo.id            Id do veículo
 * @apiSuccess {String}  veiculo.nome          Nome do veiculo.
 * @apiSuccess {String}  veiculo.placa         Placa do veiculo.
 * @apiSuccess {String}  veiculo.renavam       Renavam do veiculo.
 * @apiSuccess {String}  veiculo.marca         Marca do veiculo.
 * @apiSuccess {String}  veiculo.modelo        Modelo do veiculo.
 * @apiSuccess {Number}  veiculo.quilometragem Quilometragem atual do veiculo.
 * @apiSuccess {Boolean} veiculo.disponivel    <code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.
 * @apiSuccess {String}  veiculo.cnh_requerida CNH requerida para conduzir o veiculo.
 */

/**
 * @apiDefine Motorista
 * @apiSuccess {Object}  mostorista           Motorista que realizou a viagem.
 * @apiSuccess {Number}  motorista.id         ID do motorista.
 * @apiSuccess {String}  motorista.nome       Nome do motorista.
 * @apiSuccess {String}  motorista.apelido    Nome do motorista.
 * @apiSuccess {String}  motorista.cnh        Número da CNH do motorista.
 * @apiSuccess {String}  motorista.categoria  Categoria da CNH do motorista.
 * @apiSuccess {String}  motorista.telefone   Telefone do motorista.
 * @apiSuccess {Boolean} motorista.disponivel <code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.
 */

/**
 * @api {get} /viagens/?date=_&status=_ Recupera as Viagens
 * @apiName getViagens
 * @apiGroup Viagens
 *
 * @apiUse Header
 *
 * @apiParam {String="yyyy-MM-dd hh:mm:ss"}       [date]   Data a ser buscada
 * @apiParam {String="concluida","nao-concluida"} [status] Status da viagem
 *
 * @apiSuccess {Number} id          Id da viagem
 * @apiSuccess {String} saida       Momento do início da viagem
 * @apiSuccess {Number} km_inicial  Quilometragem inicial do veículo
 * @apiSuccess {String} [chegada]   Momento da chegada da viagem
 * @apiSuccess {Number} [km_final]  Quilometragem final do veículo
 * @apiSuccess {String} [descricao] Descrição sobre a viagem
 *
 * @apiUse Veiculo
 * @apiUse Motorista
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "saida": "2020-03-22 11:19:00",
 *      "km_inicial": 20000,
 *      "chegada": "2020-03-22 13:22:00",
 *      "km_final": 20300,
 *      "descricao": null,
 *      "veiculo": {
 *        "id": 1,
 *        "nome": "GOL-02",
 *        "placa": "QFI-1929",
 *        "renavam": "0982374987",
 *        "marca": "Volks",
 *        "modelo": "Gol",
 *        "quilometragem": "20300",
 *        "disponivel": true,
 *        "cnh_requerida": "B"
 *      },
 *      "motorista": {
 *        "id": 1,
 *        "nome": "João Souza",
 *        "apelido": "joao",
 *        "cnh": "1234234",
 *        "categoria": "AB",
 *        "telefone": "999229933",
 *        "disponivel": true
 *      }
 *    }]
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Status inválido",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Data inválida",
 *    }
 */
router.get(
  "/",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  viagens.get
);

/**
 * @api {get} /viagens/:viagemId Recupera uma viagem específica
 * @apiName getViagem
 * @apiGroup Viagens
 *
 * @apiUse Header
 *
 * @apiParam {Number} viagemId Id da viagem a ser buscado
 *
 * @apiSuccess {Number} id          Id da viagem
 * @apiSuccess {String} saida       Momento do início da viagem
 * @apiSuccess {Number} km_inicial  Quilometragem inicial do veículo
 * @apiSuccess {String} [chegada]   Momento da chegada da viagem
 * @apiSuccess {Number} [km_final]  Quilometragem final do veículo
 * @apiSuccess {String} [descricao] Descrição sobre a viagem
 *
 * @apiUse Veiculo
 * @apiUse Motorista
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "saida": "2020-03-22 11:19:00",
 *      "km_inicial": 20000,
 *      "chegada": "2020-03-22 13:22:00",
 *      "km_final": 20300,
 *      "descricao": null,
 *      "veiculo": {
 *        "id": 1,
 *        "nome": "GOL-02",
 *        "placa": "QFI-1929",
 *        "renavam": "0982374987",
 *        "marca": "Volks",
 *        "modelo": "Gol",
 *        "quilometragem": "20300",
 *        "disponivel": true,
 *        "cnh_requerida": "B"
 *      },
 *      "motorista": {
 *        "id": 1,
 *        "nome": "João Souza",
 *        "apelido": "joao",
 *        "cnh": "1234234",
 *        "categoria": "AB",
 *        "telefone": "999229933",
 *        "disponivel": true
 *      }
 *    }
 *
 * @apiError ViagemNotFound O <code>id</code> da viagem não foi encontrado.
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "mensagem": "Viagem não encontrada",
 *    }
 */
router.get(
  "/:viagemId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  viagens.get_by_id
);

/**
 * @api {get} /viagens/atual/:motoristaId Recupera a viagem atual de um motorista, caso exista
 * @apiName getViagemMotorista
 * @apiGroup Viagens
 *
 * @apiUse Header
 *
 * @apiParam {Number} motoristaId Id do motorista
 *
 * @apiSuccess {Number} id          Id da viagem
 * @apiSuccess {String} saida       Momento do início da viagem
 * @apiSuccess {Number} km_inicial  Quilometragem inicial do veículo
 * @apiSuccess {String} [descricao] Descrição sobre a viagem
 *
 * @apiUse Veiculo
 * @apiUse Motorista
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "saida": "2020-03-22 11:19:00",
 *      "km_inicial": 20000,
 *      "descricao": null,
 *      "veiculo": {
 *        "id": 1,
 *        "nome": "GOL-02",
 *        "placa": "QFI-1929",
 *        "renavam": "0982374987",
 *        "marca": "Volks",
 *        "modelo": "Gol",
 *        "quilometragem": "20300",
 *        "disponivel": false,
 *        "cnh_requerida": "B"
 *      },
 *      "motorista": {
 *        "id": 1,
 *        "nome": "João Souza",
 *        "apelido": "joao",
 *        "cnh": "1234234",
 *        "categoria": "AB",
 *        "telefone": "999229933",
 *        "disponivel": false
 *      }
 *    }
 *
 * @apiError ViagemNotFound O motorista não tem nenhuma viagem em andamento.
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "mensagem": "Viagem não encontrada",
 *    }
 */
router.get(
  "/atual/:motoristaId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  viagens.get_atual_by_motorista
);

/**
 * @api {post} /viagens Inicia uma viagem
 * @apiName saveViagem
 * @apiGroup Viagens
 *
 * @apiUse Header
 *
 * @apiParam {String="yyyy-MM-dd hh:mm:ss"} saida       Momento do início da viagem
 * @apiParam {Number}                       km_inicial  Quilometragem inicial da viagem
 * @apiParam {String}                       [descricao] Descrição sobre a viagem
 * @apiParam {Number}                       veiculo     <code>Id</code> do veículo
 * @apiParam {Number}                       motorista   <code>Id</code> do motorista
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "saida": "2020-01-20 20:52:32",
 *        "km_inicial": 200,
 *        "veiculo": 1,
 *        "motorista": 1
 *    }
 *
 * @apiSuccess {Number} id          Id da viagem
 * @apiSuccess {String} saida       Momento do início da viagem
 * @apiSuccess {Number} km_inicial  Quilometragem inicial do veículo
 * @apiSuccess {String} [descricao] Descrição sobre a viagem
 *
 * @apiUse Veiculo
 * @apiUse Motorista
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 1,
 *      "saida": "2020-01-20 20:52:32",
 *      "km_inicial": 200,
 *      "descricao": null,
 *      "veiculo": {
 *        "id": 1,
 *        "nome": "GOL-02",
 *        "placa": "QFI-1929",
 *        "renavam": "0982374987",
 *        "marca": "Volks",
 *        "modelo": "Gol",
 *        "quilometragem": "200",
 *        "disponivel": false,
 *        "cnh_requerida": "B"
 *      },
 *      "motorista": {
 *        "id": 1,
 *        "nome": "João Souza",
 *        "apelido": "joao",
 *        "cnh": "1234234",
 *        "categoria": "AB",
 *        "telefone": "999229933",
 *        "disponivel": false
 *      }
 *    }
 *
 * @apiError VeiculoNotFound   O <code>id</code> do veículo não foi encontrado.
 * @apiError MotoristaNotFound O <code>id</code> do motorista não foi encontrado.
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Veículo inexistente",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Motorista inexistente",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Veículo indisponível",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Motorista indisponível",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "CNH incompatível com a requerida pelo veículo",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 */
router.post(
  "/",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  viagens.iniciar
);

/**
 * @api {put} /viagens/:viagemId Conclui uma viagem
 * @apiName updateViagem
 * @apiGroup Viagens
 *
 * @apiUse Header
 *
 * @apiParam {Number} viagemId Id da viagem
 *
 * @apiParam {String="yyyy-MM-dd hh:mm:ss"} chegada      Momento do fim da viagem
 * @apiParam {Number}                       km_final     Quilometragem final da viagem
 * @apiParam {String="yyyy-MM-dd hh:mm:ss"} [saida]      Momento do início da viagem
 * @apiParam {Number}                       [km_inicial] Quilometragem inicial da viagem
 * @apiParam {String}                       [descricao]  Descrição sobre a viagem
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "saida": "2020-01-20 20:52:32",
 *        "km_inicial": 200,
 *        "chegada": "2020-01-20 22:52:32",
 *        "km_final": 400,
 *        "descricao": "São José da Lagoa Tapada"
 *    }
 *
 * @apiSuccess {Number} id          Id da viagem
 * @apiSuccess {String} saida       Momento do início da viagem
 * @apiSuccess {Number} km_inicial  Quilometragem inicial do veículo
 * @apiSuccess {String} chegada     Momento da chegada da viagem
 * @apiSuccess {Number} km_final    Quilometragem final do veículo
 * @apiSuccess {String} [descricao] Descrição sobre a viagem
 *
 * @apiUse Veiculo
 * @apiUse Motorista
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "saida": "2020-01-20 20:52:32",
 *      "km_inicial": 200,
 *      "chegada": "2020-01-20 22:52:32",
 *      "km_final": 400,
 *      "descricao": "São José da Lagoa Tapada",
 *      "veiculo": {
 *        "id": 1,
 *        "nome": "GOL-02",
 *        "placa": "QFI-1929",
 *        "renavam": "0982374987",
 *        "marca": "Volks",
 *        "modelo": "Gol",
 *        "quilometragem": "20300",
 *        "disponivel": true,
 *        "cnh_requerida": "B"
 *      },
 *      "motorista": {
 *        "id": 1,
 *        "nome": "João Souza",
 *        "apelido": "joao",
 *        "cnh": "1234234",
 *        "categoria": "AB",
 *        "telefone": "999229933",
 *        "disponivel": true
 *      }
 *    }
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Viagem não encontrada",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Data de chegada anterior a data de saída",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "KM final menor que a KM inicial",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Parâmetro inválido",
 *    }
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "mensagem": "Viagem não encontrada",
 *    }
 */
router.put(
  "/:viagemId",
  (req, res, next) => check_auth(req, res, next, constantes.MOTORISTA),
  viagens.concluir
);

/**
 * @api {delete} /viagens/:viagemId Deleta uma Viagem
 * @apiName deleteViagem
 * @apiGroup Viagens
 * @apiPermission admin
 *
 * @apiParam {Number} viagemId Id da viagem.
 *
 * @apiUse Header
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No Content
 */
router.delete(
  "/:viagemId",
  (req, res, next) => check_auth(req, res, next, constantes.ADMIN),
  viagens.deletar
);

module.exports = router;
