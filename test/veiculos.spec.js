const chai = require("chai");
const app = require("../index");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const request = require("supertest");

describe("Veículos", () => {
  let token;

  before((done) => {
    request(app)
      .post("/login")
      .send({
        apelido: "adminTeste",
        senha: "admin",
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("/GET Veículos", () => {
    it("Testando autenticação em GET", (done) => {
      request(app)
        .get("/veiculos")
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).have.status(401);
          chai.expect(res.body.mensagem).to.equals("Sem permissão para acesso");
          done();
        });
    });

    it("Recuperando veículos", (done) => {
      request(app)
        .get("/veiculos")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).have.status(200);
          done();
        });
    });
  });
});
