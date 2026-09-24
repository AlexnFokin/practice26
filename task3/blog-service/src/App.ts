import express from 'express';
import { setupMiddleware } from './middlewares/index';
import { errorMiddleware } from './middlewares/error.middleware';
import { router } from './routes';
import path from 'path';

const app = express();
app.set('query parser', 'extended');
setupMiddleware(app);

app.use('/media', express.static(path.resolve('media')));
app.use(router);
app.use(errorMiddleware);

export default app;