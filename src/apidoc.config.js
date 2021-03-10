require("dotenv").config({
    path: ".env",
});

module.exports = {
    "name": "viagensPMO",
    "version": "1.0.0",
    "description": "Documentação básica da API Rest ViagensPMO",
    "title": "ViagensPMO API Rest",
    "url": process.env.URL + ":" + process.env.PORT
}