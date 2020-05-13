const express = require("express");
const check_auth = require("../middleware/check_auth");
const abastecimentos = require("../service/abastecimentos");
const MOTORISTA = require("../constantes").MOTORISTA;
const router = express.Router();

router.get(
  "/",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  abastecimentos.get
);

router.get(
  "/:abastecimentoId",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  abastecimentos.get_by_id
);

router.post(
  "/",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  abastecimentos.save
);

router.delete(
  "/:abastecimentoId",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  abastecimentos.delete
);

module.exports = router;
