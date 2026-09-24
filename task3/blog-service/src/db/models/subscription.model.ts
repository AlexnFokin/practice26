import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface SubscriptionAttributes {
    id: string;
    subscriberId: string;
    subscribedToId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface SubscriptionCreationAttributes
    extends Optional<SubscriptionAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
    public id!: string;
    public subscriberId!: string;
    public subscribedToId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Subscription.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        subscriberId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        subscribedToId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'subscriptions',
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        indexes: [
            { fields: ['subscriberId'] },
            { fields: ['subscribedToId'] },
            {
                unique: true,
                fields: ['subscriberId', 'subscribedToId'],
                name: 'unique_subscription',
            },
        ],
    }
);

export { Subscription };