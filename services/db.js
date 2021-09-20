const Sequelize = require("sequelize");
require('dotenv').config()

// const connectionString = `postgresql://${process.env.SQL_USER}:${process.env.SQL_PASSWORD}@${process.env.SQL_HOST}:${process.env.SQL_PORT}/${process.env.SQL_DATABASE}`

// console.log(connectionString)

// const db = new Sequelize(connectionString);

var db = new Sequelize({
    database: process.env.SQL_DATABASE,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
      },
  })

module.exports = db