'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tags', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            schema: process.env.DB_SCHEMA,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            { tableName: 'tags', schema: process.env.DB_SCHEMA }
        );
    },
};