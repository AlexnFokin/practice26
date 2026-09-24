'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('subscriptions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            subscriberId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            subscribedToId: {
                type: Sequelize.UUID,
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
            { tableName: 'subscriptions', schema: process.env.DB_SCHEMA },
            ['subscriberId'],
            { name: 'idx_subscriptions_subscriber_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'subscriptions', schema: process.env.DB_SCHEMA },
            ['subscribedToId'],
            { name: 'idx_subscriptions_subscribed_to_id' }
        );

        await queryInterface.addIndex(
            { tableName: 'subscriptions', schema: process.env.DB_SCHEMA },
            ['subscriberId', 'subscribedToId'],
            { name: 'unique_subscription', unique: true }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            { tableName: 'subscriptions', schema: process.env.DB_SCHEMA }
        );
    },
};