# API RestFull para gerenciamento de viagens

![GitHub top language](https://img.shields.io/github/languages/top/juakacc/travel-manager-api)

API para consumir os recursos disponíveis no gerenciador de viagens.

## Executando projeto localmente

Clone o projeto e instale as dependências

```
git clone https://github.com/juakacc/travel-manager-api.git
cd travel-manager-api
npm i
```

Altere o arquivo `.envExample` para `.env` e coloque suas configurações locais.

Execute as migrações para preparar e inicializar o banco de dados:

```
npx sequelize-cli db:migrate --env [option]
npx sequelize-cli db:seed:all
```

- Com o comando `seed` será criado um motorista default:

  - Apelido: admin
  - Senha: admin

- Caso deseje executar as migrações em um ambiente de teste você pode especificar `test` em option.

### Comandos

- `npm start` - Para iniciar a aplicação;

#### Estamos trabalhando em melhorias futuras

- `npm test` - Para executar os testes a aplicação;

### Documentação

- Após iniciar a aplicação a documentação a respeito da API com descrição dos endpoints fica disponível na raiz: `http://local:PORT/`

## Procedimento para deploy no Heroku

Criando aplicação no Heroku

```
heroku create viagens-api
```

Se for utilizar o jawdb, caso contrário desconsidere essa etapa.

```
heroku addons:create jawsdb --app HEROKU_APP
```

Configurando as variáveis de ambiente (substitua os ? pelos valores correspondentes):

```
heroku config:set LOCAL_DB=? DATABASE_DB=? PROD_DB_PORT=? USERNAME_DB=? PASSWORD_DB=? NODE_ENV=production SECRET_KEY_TOKEN=? --app HEROKU_APP
```

Adicionando repositório do Heroku

```
git remote add heroku HEROKU_URL
```

Executando as migrações no Heroku

```
heroku run sequelize-cli db:migrate --app HEROKU_APP
heroku run sequelize-cli db:seed:all --app HEROKU_APP
```

## Backup do banco de dados

### Realizando backup do banco

```
\$ mysqldump -h HOST -u USER -pPASS DATABASE > backup.sql
```

### Retornando backup para o banco

```
\$ mysql -h HOST -u USER -pPASS DATABASE < backup.sql
```
