import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface CommentAttributes {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CommentCreationAttributes
    extends Optional<CommentAttributes, 'id' | 'parentId' | 'createdAt' | 'updatedAt'> { }

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: string;
    public content!: string;
    public postId!: string;
    public authorId!: string;
    public parentId!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Comment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
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
        tableName: 'comments',
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        indexes: [
            { fields: ['postId'] },
            { fields: ['authorId'] },
            { fields: ['parentId'] },
        ],
    }
);

export { Comment };