import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface TagAttributes {
    id: string;
    name: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

interface TagCreationAttributes
    extends Optional<TagAttributes, 'id' | 'count' | 'createdAt' | 'updatedAt'> { }

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
    public id!: string;
    public name!: string;
    public count!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Tag.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: 'tags',
        schema: process.env.DB_SCHEMA,
        timestamps: true,
    }
);

export { Tag };