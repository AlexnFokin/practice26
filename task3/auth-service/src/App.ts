import express from 'express';
import { setupMiddleware } from './middlewares/index';
import { errorMiddleware } from './middlewares/error.middleware';
import { router } from './routes';

const app = express();

setupMiddleware(app);

app.use(router);

app.use(errorMiddleware);

export default app;