require('dotenv').config();

module.exports = {
    development: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
    },
    test: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
    },
    production: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
    }
};