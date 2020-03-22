Deploy

- heroku create viagens-api
- heroku addons:create jawsdb

- heroku config:set LOCAL_DB= DATABASE_DB= PROD_DB_PORT= USERNAME_DB= PASSWORD_DB= NODE_ENV=production SECRET_KEY_TOKEN=

- git remote add heroku https://git.heroku.com/viagens-api-dev.git