import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export type PostAccessRequestStatus = 'pending' | 'approved' | 'rejected';

interface PostAccessRequestAttributes {
    id: string;
    postId: string;
    userId: string;
    status: PostAccessRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface PostAccessRequestCreationAttributes
    extends Optional<PostAccessRequestAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> { }

class PostAccessRequest extends Model<PostAccessRequestAttributes, PostAccessRequestCreationAttributes> implements PostAccessRequestAttributes {
    public id!: string;
    public postId!: string;
    public userId!: string;
    public status!: PostAccessRequestStatus;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

PostAccessRequest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
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
        tableName: 'access_requests',
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        indexes: [
            { fields: ['postId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            {
                unique: true,
                fields: ['postId', 'userId'],
                name: 'unique_access_request',
            },
        ],
    }
);

export { PostAccessRequest };