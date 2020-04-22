define({ "api": [
  {
    "type": "post",
    "url": "/login",
    "title": "Autenticar-se na aplicação",
    "name": "login",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Apelido do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "senha",
            "description": "<p>Senha do motorista.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"apelido\": \"joao123\",\n  \"senha\": \"adfasdf\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token JWT de autenticação.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"token\": \"TOKEN_JWT\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Parâmetro inválido\",\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Login e senha não correspondem\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/login.js",
    "groupTitle": "Login"
  },
  {
    "type": "delete",
    "url": "/motoristas/:motoristaId",
    "title": "Deleta um Motorista",
    "name": "deleteMotorista",
    "group": "Motoristas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "motoristaId",
            "description": "<p>Id do motorista</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/motoristas.js",
    "groupTitle": "Motoristas",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/motoristas/:motoristaId",
    "title": "Retorna um Motorista específico",
    "name": "getMotorista",
    "group": "Motoristas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "motoristaId",
            "description": "<p>Id do motorista</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "permissoes",
            "description": "<p>Permissões do motorista.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"nome\": \"João\",\n  \"apelido\": \"joao\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AB\",\n  \"telefone\": \"999999999\",\n  \"disponivel\": true,\n  \"permissoes\": [\n    \"motorista\",\n    \"admin\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MotoristaNotFound",
            "description": "<p>O <code>id</code> do motorista não foi encontrado.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"mensagem\": \"Motorista não encontrado\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/motoristas.js",
    "groupTitle": "Motoristas",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/motoristas",
    "title": "Retorna uma lista com os Motoristas",
    "name": "getMotoristas",
    "group": "Motoristas",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "mostorista",
            "description": "<p>Motoristas cadastrados.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "motorista.id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "motorista.nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "motorista.apelido",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "motorista.cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "motorista.categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "motorista.telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "motorista.disponivel",
            "description": "<p><code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": 1,\n  \"nome\": \"João\",\n  \"apelido\": \"joao\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AB\",\n  \"telefone\": \"999999999\",\n  \"disponivel\": true\n}, {\n  \"id\": 2,\n  \"nome\": \"Maria\",\n  \"apelido\": \"maria\",\n  \"cnh\": \"54321\",\n  \"categoria\": \"B\",\n  \"telefone\": \"999999999\",\n  \"disponivel\": false\n}]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/motoristas.js",
    "groupTitle": "Motoristas",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/motoristas",
    "title": "Cadastra um Motorista",
    "name": "saveMotorista",
    "group": "Motoristas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Apelido do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"A\"",
              "\"B\"",
              "\"C\"",
              "\"D\"",
              "\"E\"",
              "\"AB\"",
              "\"AC\"",
              "\"AD\"",
              "\"AE\""
            ],
            "optional": false,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "senha",
            "description": "<p>Senha do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "permissoes",
            "defaultValue": "{motorista: true}",
            "description": "<p>Permissões do motorista</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "permissoes[motorista]",
            "description": "<p>Permissão de motorista</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "permissoes[admin]",
            "description": "<p>Permissão de administrador</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"nome\": \"João Costa\",\n  \"apelido\": \"joao123\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AC\",\n  \"telefone\": \"999999999\",\n  \"senha\": \"acasdoasdnk\",\n  \"permissoes\": {\n     \"motorista\": true,\n     \"admin\": true,\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"id\": 1,\n  \"nome\": \"João\",\n  \"apelido\": \"joao\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AB\",\n  \"telefone\": \"999999999\",\n  \"disponivel\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Parâmetro inválido\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/motoristas.js",
    "groupTitle": "Motoristas",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/motoristas/:motoristaId",
    "title": "Atualiza um Motorista",
    "name": "updateMotorista",
    "group": "Motoristas",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "motoristaId",
            "description": "<p>Id do motorista</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "apelido",
            "description": "<p>Apelido do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"A\"",
              "\"B\"",
              "\"C\"",
              "\"D\"",
              "\"E\"",
              "\"AB\"",
              "\"AC\"",
              "\"AD\"",
              "\"AE\""
            ],
            "optional": true,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"nome\": \"João Costa\",\n  \"apelido\": \"joao123\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AC\",\n  \"telefone\": \"999999999\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"nome\": \"João\",\n  \"apelido\": \"joao\",\n  \"cnh\": \"12345\",\n  \"categoria\": \"AB\",\n  \"telefone\": \"999999999\",\n  \"disponivel\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Motorista não encontrado\",\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Parâmetro inválido\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/motoristas.js",
    "groupTitle": "Motoristas",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/veiculos/:veiculoId",
    "title": "Deleta um Veículo",
    "name": "deleteVeiculo",
    "group": "Veiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "veiculoId",
            "description": "<p>ID do veículo</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/veiculos/:veiculoId",
    "title": "Retorna um veículo específico",
    "name": "getVeiculo",
    "group": "Veiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "veiculoId",
            "description": "<p>ID do veículo a ser buscado</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quilometragem",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"nome\": \"GOL02\",\n  \"placa\": \"QGG3322\",\n  \"renavam\": \"156987965\",\n  \"marca\": \"Volks\",\n  \"modelo\": \"Gol\",\n  \"quilometragem\": 11200,\n  \"disponivel\": true,\n  \"cnh_requerida\": \"B\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "VeiculoNotFound",
            "description": "<p>O <code>id</code> do veículo não foi encontrado.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"mensagem\": \"Veículo não encontrado\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/veiculos",
    "title": "Retorna uma lista com os veículos",
    "name": "getVeiculos",
    "group": "Veiculos",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "veiculo",
            "description": "<p>Veículos cadastrados.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "veiculo.id",
            "description": "<p>ID do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "veiculo.quilometragem",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "veiculo.disponivel",
            "description": "<p><code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": 1,\n  \"nome\": \"MOTO\",\n  \"placa\": \"KDJ2929\",\n  \"renavam\": \"123123454\",\n  \"marca\": \"Honda\",\n  \"modelo\": \"Fan\",\n  \"quilometragem\": 200,\n  \"disponivel\": false,\n  \"cnh_requerida\": \"A\"\n}, {\n  \"id\": 2,\n  \"nome\": \"GOL02\",\n  \"placa\": \"QGG3322\",\n  \"renavam\": \"156987965\",\n  \"marca\": \"Volks\",\n  \"modelo\": \"Gol\",\n  \"quilometragem\": 11200,\n  \"disponivel\": true,\n  \"cnh_requerida\": \"B\"\n}]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/veiculos/disponiveis",
    "title": "Retorna uma lista com os veículos disponíveis para viagem",
    "name": "getVeiculosDisponiveis",
    "group": "Veiculos",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "veiculo",
            "description": "<p>Veículos cadastrados.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "veiculo.id",
            "description": "<p>ID do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "veiculo.quilometragem",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "veiculo.disponivel",
            "description": "<p><code>True</code> (veículos disponíveis)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "veiculo.cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": 2,\n  \"nome\": \"GOL02\",\n  \"placa\": \"QGG3322\",\n  \"renavam\": \"156987965\",\n  \"marca\": \"Volks\",\n  \"modelo\": \"Gol\",\n  \"quilometragem\": 11200,\n  \"disponivel\": true,\n  \"cnh_requerida\": \"B\"\n}]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/veiculos",
    "title": "Cadastra um novo Veículo",
    "name": "saveVeiculo",
    "group": "Veiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "quilometragem",
            "defaultValue": "0",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"A\"",
              "\"B\"",
              "\"C\"",
              "\"D\"",
              "\"E\"",
              "\"AB\"",
              "\"AC\"",
              "\"AD\"",
              "\"AE\""
            ],
            "optional": false,
            "field": "cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"nome\": \"GOL-02\",\n   \"placa\": \"QFF-3032\",\n   \"renavam\": \"123456\",\n   \"marca\": \"Volkswagem\",\n   \"modelo\": \"Gol\",\n \t\"quilometragem\": 3000,\n   \"cnh_requerida\": \"B\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quilometragem",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o veiculo esteja disponível, <code>False</code> caso contrário.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"id\": 1,\n  \"nome\": \"GOL-02\",\n  \"placa\": \"QFF-3032\",\n  \"renavam\": \"123456\",\n  \"marca\": \"Volkswagem\",\n  \"modelo\": \"Gol\",\n\t\"quilometragem\": 3000,\n  \"cnh_requerida\": \"B\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Parâmetro inválido\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/veiculos/:veiculoId",
    "title": "Atualiza um Veículo",
    "name": "updateVeiculo",
    "group": "Veiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "veiculoId",
            "description": "<p>Id do veículo</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "nome",
            "description": "<p>Nome do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "placa",
            "description": "<p>Placa do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "renavam",
            "description": "<p>Renavam do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "marca",
            "description": "<p>Marca do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "modelo",
            "description": "<p>Modelo do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "quilometragem",
            "description": "<p>Quilometragem atual do veiculo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"A\"",
              "\"B\"",
              "\"C\"",
              "\"D\"",
              "\"E\"",
              "\"AB\"",
              "\"AC\"",
              "\"AD\"",
              "\"AE\""
            ],
            "optional": true,
            "field": "cnh_requerida",
            "description": "<p>CNH requerida para conduzir o veiculo.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"nome\": \"GOL-02\",\n   \"placa\": \"QFF-3032\",\n   \"renavam\": \"123456\",\n   \"marca\": \"Volkswagem\",\n   \"modelo\": \"Gol\",\n \t\"quilometragem\": 3000,\n   \"cnh_requerida\": \"B\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "nome",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apelido",
            "description": "<p>Nome do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cnh",
            "description": "<p>Número da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "categoria",
            "description": "<p>Categoria da CNH do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "telefone",
            "description": "<p>Telefone do motorista.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "disponivel",
            "description": "<p><code>True</code> caso o motorista esteja disponível, <code>False</code> caso contrário.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"nome\": \"GOL-02\",\n  \"placa\": \"QFF-3032\",\n  \"renavam\": \"123456\",\n  \"marca\": \"Volkswagem\",\n  \"modelo\": \"Gol\",\n  \"quilometragem\": 3000,\n  \"disponivel\": true,\n  \"cnh_requerida\": \"B\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Veiculo não encontrado\",\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"mensagem\": \"Parâmetro inválido\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/veiculos.js",
    "groupTitle": "Veiculos",
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer TOKEN\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
