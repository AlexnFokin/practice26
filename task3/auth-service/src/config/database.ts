import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize({
     host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
});

export default sequelize;