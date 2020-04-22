const express = require("express");
const morgan = require("morgan");
const bodyparse = require("body-parser");
const HttpStatus = require("http-status-codes");
const app = express();

const veiculoRotas = require("./controller/veiculos");
const motoristaRotas = require("./controller/motoristas");
const viagensRotas = require("./controller/viagens");
const loginRotas = require("./controller/login");

app.use(morgan("dev"));
app.use(
  bodyparse.urlencoded({
    extended: false,
  })
);
app.use(bodyparse.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(HttpStatus.OK).json({});
  }
  next();
});

app.use("/veiculos", veiculoRotas);
app.use("/motoristas", motoristaRotas);
app.use("/viagens", viagensRotas);
app.use("/login", loginRotas);

app.use(express.static(__dirname + "/doc"));
// app.get("/doc", (req, res) => {
//   res.render("index.html");
// });

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    mensagem: error.message,
  });
});

module.exports = app;
