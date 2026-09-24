'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('posts', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            authorId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            isPublic: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            isHidden: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: [],
                allowNull: false,
            },
            images: {
                type: Sequelize.JSONB,
                defaultValue: [],
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
            { tableName: 'posts', schema: process.env.DB_SCHEMA },
            ['authorId'],
            { name: 'idx_posts_author_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'posts', schema: process.env.DB_SCHEMA },
            ['isPublic'],
            { name: 'idx_posts_is_public' }
        );

        await queryInterface.addIndex(
            { tableName: 'posts', schema: process.env.DB_SCHEMA },
            ['isHidden'],
            { name: 'idx_posts_is_hidden' }
        );

        await queryInterface.addIndex(
            { tableName: 'posts', schema: process.env.DB_SCHEMA },
            ['tags'],
            { name: 'idx_posts_tags', using: 'GIN' }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            { tableName: 'posts', schema: process.env.DB_SCHEMA }
        );
    },
};