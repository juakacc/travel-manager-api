const http = require("http");
const app = require("./src/app");

require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env",
});

const porta = process.env.PORT || 8888;
const server = http.createServer(app);

server.listen(porta);

module.exports = app;
