'use strict';
const { config } = require('dotenv');

config();

module.exports = {
    development: {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
    },
    test: {
        use_env_variable: 'DATABASE_URL_TEST',
        dialect: 'postgres',
        logging: false,
    },
    production: {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT
    },
};