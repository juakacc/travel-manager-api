Procedimento para deploy no Heroku

- heroku create viagens-api
- heroku addons:create jawsdb --app HEROKU_APP

- heroku config:set LOCAL_DB= DATABASE_DB= PROD_DB_PORT= USERNAME_DB= PASSWORD_DB= NODE_ENV=production SECRET_KEY_TOKEN= --app HEROKU_APP

- git remote add heroku HEROKU_URL

heroku run sequelize-cli db:migrate --app HEROKU_APP
heroku run sequelize-cli db:seed:all --app HEROKU_APP

- Realizar backup do banco 
$ mysqldump -h HOST -u USER -pPASS DATABASE > backup.sql

- Retornar Backup para o banco
$ mysql -h HOST -u USER -pPASS DATABASE < backup.sql