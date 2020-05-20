const express = require("express");
const check_auth = require("../middleware/check_auth");
const servicos = require("../service/servicos");
const MOTORISTA = require("../constantes").MOTORISTA;
const router = express.Router({
  mergeParams: true,
});

router.get(
  "/",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  servicos.get
);

router.get(
  "/:servicoId",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  servicos.get_by_id
);

router.post(
  "/",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  servicos.save
);

router.delete(
  "/:servicoId",
  (req, res, next) => check_auth(req, res, next, MOTORISTA),
  servicos.delete
);

module.exports = router;
