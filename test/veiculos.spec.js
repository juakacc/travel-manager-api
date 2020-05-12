const chai = require("chai");
const request = require("supertest");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;

const app = require("../index");
const Veiculo = require("../src/models").veiculo;

describe("Veículos", () => {
  let Authorization;

  before((done) => {
    request(app)
      .post("/login")
      .send({
        apelido: "adminTeste",
        senha: "admin",
      })
      .end((err, res) => {
        Authorization = `Bearer ${res.body.token}`;
        done();
      });
  });

  // Clean table vehicles
  before((done) => {
    Veiculo.destroy({
      where: {},
    })
      .then(() => {
        done();
      })
      .catch(() => {});
  });

  const vehicleDefault = {
    nome: "GOL-02",
    placa: "QFF-3032",
    renavam: "123456",
    marca: "Volkswagem",
    modelo: "Gol",
    quilometragem: 3000,
    cnh_requerida: "B",
  };

  describe("/POST Veículos", () => {
    it("Testando autenticação em POST", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {});

      request(app)
        .post("/veiculos")
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(401);
          expect(res.body.mensagem).to.equals("Sem permissão para acesso");
          done();
        });
    });

    it("Salvando veículo corretamente", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {});

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).have.status(201);
          expect(res.body).to.an("object");
          const vehicleResponse = res.body;
          expect(vehicleResponse.id).to.an("number");
          expect(vehicleResponse.nome).to.equal(vehicle.nome);
          expect(vehicleResponse.placa).to.equal(vehicle.placa);
          expect(vehicleResponse.renavam).to.equal(vehicle.renavam);
          expect(vehicleResponse.marca).to.equal(vehicle.marca);
          expect(vehicleResponse.modelo).to.equal(vehicle.modelo);
          expect(vehicleResponse.cnh_requerida).to.equal(vehicle.cnh_requerida);

          vehicleDefault.id = vehicleResponse.id; // Para futuros testes
        });

      const vehicle2 = Object.assign({}, vehicleDefault, {
        nome: "GOL-05",
        placa: "QRT-3589",
      });

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle2)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).have.status(201);
          expect(res.body).to.an("object");
          const vehicleResponse = res.body;
          expect(vehicleResponse.id).to.an("number");
          expect(vehicleResponse.nome).to.equal(vehicle2.nome);
          expect(vehicleResponse.placa).to.equal(vehicle2.placa);
          done();
        });
    });

    it("Tentando salvar veículo com placa repetida", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {});

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res.body.mensagem)
            .to.an("string")
            .to.equal("A placa informada já está cadastrada");
          done();
        });
    });

    it("Tentando salvar veículo sem nome", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {
        placa: "QJF-6565",
        nome: "",
      });

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res.body.mensagem)
            .to.an("string")
            .to.equal("O nome é obrigatório");
          done();
        });
    });

    it("Tentando salvar veículo com categoria inválida", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {
        placa: "QJF-6565",
        cnh_requerida: "J",
      });

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res.body.mensagem)
            .to.an("string")
            .to.equal(
              "Categoria da CNH inválida. Valores aceitos: [A, B, C, D, E, AB, AC, AD, AE]"
            );
          done();
        });
    });

    it("Tentando salvar veículo com quilometragem inválida", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {
        placa: "QJF-6565",
        quilometragem: "abc",
      });

      request(app)
        .post("/veiculos")
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res.body.mensagem)
            .to.an("string")
            .to.equal("O valor da quilometragem é inválido");
          done();
        });
    });
  });

  describe("/GET Veículos", () => {
    it("Testando autenticação em GET", (done) => {
      request(app)
        .get("/veiculos")
        .end((err, res) => {
          expect(res).have.status(401);
          expect(res.body.mensagem).to.equals("Sem permissão para acesso");
          done();
        });
    });

    it("Recuperando veículos", (done) => {
      request(app)
        .get("/veiculos")
        .set({ Authorization })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.an("array").to.lengthOf(2);
          done();
        });
    });

    it("Recuperando veículo específico", (done) => {
      request(app)
        .get(`/veiculos/${vehicleDefault.id}`)
        .set({ Authorization })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).have.status(200);
          expect(res.body).to.be.not.null;
          const vehicleResponse = res.body;
          expect(vehicleResponse.id).to.an("number");
          expect(vehicleResponse.nome).to.equal(vehicleDefault.nome);
          expect(vehicleResponse.placa).to.equal(vehicleDefault.placa);
          expect(vehicleResponse.renavam).to.equal(vehicleDefault.renavam);
          expect(vehicleResponse.marca).to.equal(vehicleDefault.marca);
          expect(vehicleResponse.modelo).to.equal(vehicleDefault.modelo);
          expect(vehicleResponse.cnh_requerida).to.equal(
            vehicleDefault.cnh_requerida
          );
          done();
        });
    });

    it("Recuperando veículo inexistente", (done) => {
      request(app)
        .get("/veiculos/312548787")
        .set({ Authorization })
        .end((err, res) => {
          expect(res).have.status(404);
          expect(res).to.be.json;
          expect(res.body.mensagem).to.equals("Veiculo não encontrado");
          done();
        });
    });
  });

  describe("/PUT Veículos", () => {
    it("Testando autenticação em PUT", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, { nome: "NOVO_NOME" });

      request(app)
        .put(`/veiculos/${vehicleDefault.id}`)
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(401);
          expect(res.body.mensagem).to.equals("Sem permissão para acesso");
          done();
        });
    });

    it("Atualizando veículo corretamente", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {
        nome: "NOVO_NOME",
        renavam: "987654321",
      });
      delete vehicle.id;

      request(app)
        .put(`/veiculos/${vehicleDefault.id}`)
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("object");

          const vehicleResponse = res.body;
          expect(vehicleResponse.id)
            .to.an("number")
            .to.equal(vehicleDefault.id);

          expect(vehicleResponse.nome).to.equal(vehicle.nome);
          expect(vehicleResponse.nome).to.not.equal(vehicleDefault.nome);

          expect(vehicleResponse.renavam).to.equal(vehicle.renavam);
          expect(vehicleResponse.renavam).to.not.equal(vehicleDefault.renavam);

          expect(vehicleResponse.placa).to.equal(vehicleDefault.placa);
          expect(vehicleResponse.marca).to.equal(vehicleDefault.marca);
          expect(vehicleResponse.modelo).to.equal(vehicleDefault.modelo);
          expect(vehicleResponse.cnh_requerida).to.equal(
            vehicleDefault.cnh_requerida
          );
          done();
        });
    });

    it("Atualizando veículo inexistente", (done) => {
      request(app)
        .put("/veiculos/312548787")
        .set({ Authorization })
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res).to.be.json;
          expect(res.body.mensagem).to.equals("Veículo não encontrado");
          done();
        });
    });

    it("Atualizando veículo com outra placa já cadastrada", (done) => {
      const vehicle = Object.assign({}, vehicleDefault, {
        nome: "NOVO_NOME",
        placa: "QRT-3589", // placa que foi cadastrada no segundo veículo
      });
      delete vehicle.id;

      request(app)
        .put(`/veiculos/${vehicleDefault.id}`)
        .set({ Authorization })
        .send(vehicle)
        .end((err, res) => {
          expect(res).have.status(400);
          expect(res.body.mensagem).to.equals(
            "A placa informada já está cadastrada"
          );
          done();
        });
    });
  });

  describe("/DELETE Veículos", () => {
    it("Testando autenticação em DELETE", (done) => {
      request(app)
        .delete(`/veiculos/${vehicleDefault.id}`)
        .end((err, res) => {
          expect(res).have.status(401);
          expect(res.body.mensagem).to.equals("Sem permissão para acesso");
          done();
        });
    });

    it("Removendo veículo existente", (done) => {
      request(app)
        .delete(`/veiculos/${vehicleDefault.id}`)
        .set({ Authorization })
        .end((err, res) => {
          expect(res).have.status(204);
          expect(res.body).to.an("object").to.eql({});
          done();
        });
    });

    it("Removendo veículo inexistente", (done) => {
      request(app)
        .delete("/veiculos/2312354654")
        .set({ Authorization })
        .end((err, res) => {
          expect(res).have.status(204);
          expect(res.body).to.an("object").to.eql({});
          done();
        });
    });
  });
});
