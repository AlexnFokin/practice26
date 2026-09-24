import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./user.model";

interface TokenAttributes {
    id: string;
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    public id!: string;
    public userId!: string;
    public refreshToken!: string;
    public expiresAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Token.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
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
}, {
    sequelize,
    tableName: 'tokens',
    schema: process.env.DB_SCHEMA,
    timestamps: true,
});

export { Token };