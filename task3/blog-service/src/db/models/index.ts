import { Sequelize } from 'sequelize';
import { Post } from './post.model';
import { Comment } from './comment.model';
import { Subscription } from './subscription.model';
import { AccessRequest } from './post-access-request.model';
import { Tag } from './tag.model';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
});

const models = {
    Post,
    Comment,
    Subscription,
    AccessRequest,
    Tag,
};

// Инициализация моделей
Object.values(models).forEach((model: any) => {
    if (model.initModel) {
        model.initModel(sequelize);
    }
});

// Установка ассоциаций
Object.values(models).forEach((model: any) => {
    if (model.associate) {
        model.associate(models);
    }
});

export { sequelize, ...models };