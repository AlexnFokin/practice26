'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
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
            authorId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            parentId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: { tableName: 'comments', schema: process.env.DB_SCHEMA },
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
            { tableName: 'comments', schema: process.env.DB_SCHEMA },
            ['postId'],
            { name: 'idx_comments_post_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'comments', schema: process.env.DB_SCHEMA },
            ['authorId'],
            { name: 'idx_comments_author_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'comments', schema: process.env.DB_SCHEMA },
            ['parentId'],
            { name: 'idx_comments_parent_id' }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            { tableName: 'comments', schema: process.env.DB_SCHEMA }
        );
    },
};