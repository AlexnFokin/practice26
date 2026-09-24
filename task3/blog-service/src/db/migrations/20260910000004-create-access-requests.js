'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `CREATE TYPE "${process.env.DB_SCHEMA}"."enum_access_requests_status" 
             AS ENUM ('pending', 'approved', 'rejected');`
        );

        await queryInterface.createTable('access_requests', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            postId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: { tableName: 'posts', schema: process.env.DB_SCHEMA },
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            status: {
                type: `"${process.env.DB_SCHEMA}"."enum_access_requests_status"`,
                defaultValue: 'pending',
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

        await queryInterface.addIndex(
            { tableName: 'access_requests', schema: process.env.DB_SCHEMA },
            ['postId'],
            { name: 'idx_access_requests_post_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'access_requests', schema: process.env.DB_SCHEMA },
            ['userId'],
            { name: 'idx_access_requests_user_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'access_requests', schema: process.env.DB_SCHEMA },
            ['status'],
            { name: 'idx_access_requests_status' }
        );

        await queryInterface.addIndex(
            { tableName: 'access_requests', schema: process.env.DB_SCHEMA },
            ['postId', 'userId'],
            { name: 'unique_access_request', unique: true }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            { tableName: 'access_requests', schema: process.env.DB_SCHEMA }
        );

        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "${process.env.DB_SCHEMA}"."enum_access_requests_status";`
        );
    },
};