const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("Veículos", () => {
  describe("/GET Veículos", () => {
    it("Testando autenticação em GET", () => {
      chai
        .request("http://localhost:8888")
        .get("/veiculos")
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).to.have.status(401);
          chai.expect(res.body.mensagem).to.equals("Sem permissão para acesso");
        });
    });
  });
});
