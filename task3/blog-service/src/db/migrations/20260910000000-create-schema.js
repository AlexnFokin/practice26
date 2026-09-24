'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(
            `CREATE SCHEMA IF NOT EXISTS "${process.env.DB_SCHEMA}";`
        );
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(
            `DROP SCHEMA IF EXISTS "${process.env.DB_SCHEMA}" CASCADE;`
        );
    },
};