import { Router } from 'express';
import { router as postRouter } from './post.routes';
import { router as commentRouter } from './comment.router';

const router = Router();

router.use('/blog', postRouter);
router.use('/comments', commentRouter)
export { router };