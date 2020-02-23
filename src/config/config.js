require('dotenv').config()

module.exports = {
  development: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    host: process.env.LOCAL_DB,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,

      dateStrings: true,
      typeCast: function (field, next) { // for reading from database
          if (field.type === 'DATETIME') {
              return field.string()
          }
          return next()
      }
    },
    timezone: '-03:00', // for writing to database
  },
  production: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    host: process.env.LOCAL_DB,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
      
      dateStrings: true,
      typeCast: function (field, next) { // for reading from database
          if (field.type === 'DATETIME') {
              return field.string()
          }
          return next()
      }
    },
    // timezone: '-03:00', // for writing to database
  }
}