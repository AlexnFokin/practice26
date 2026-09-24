import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { PostImage } from '@/types/post/postImage';

interface PostAttributes {
    id: string;
    title: string;
    content: string;
    authorId: string;
    isPublic: boolean;
    isHidden: boolean;
    tags: string[];
    images: PostImage[];
    createdAt: Date;
    updatedAt: Date;
}

interface PostCreationAttributes
    extends Optional<
        PostAttributes,
        'id' | 'isPublic' | 'isHidden' | 'tags' | 'images' | 'createdAt' | 'updatedAt'
    > { }

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public id!: string;
    public title!: string;
    public content!: string;
    public authorId!: string;
    public isPublic!: boolean;
    public isHidden!: boolean;
    public tags!: string[];
    public images!: PostImage[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Post.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        isHidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            allowNull: false,
        },
        images: {
            type: DataTypes.JSONB,
            defaultValue: [],
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
        tableName: 'posts',
        schema: process.env.DB_SCHEMA,
        timestamps: true,
        indexes: [
            { fields: ['authorId'] },
            { fields: ['isPublic'] },
            { fields: ['isHidden'] },
            { fields: ['tags'], using: 'GIN' },
        ],
    },
);

export { Post };