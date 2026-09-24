import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware';
import { container } from '@/container';
import { PostController } from '@/controllers/post/post.controller';
import {
    getPostsValidator,
    postIdValidator,
    createPostValidator,
    updatePostValidator,
} from '@/validators/post.validator';
import { upload } from '@/middlewares/upload.middleware';

const postController = container.getController<PostController>('postController');

const router = Router();

router.get('/', getPostsValidator, validate, postController.getPosts);
router.post('/',
    upload.array('images', 5),
    // createPostValidator,
    // validate,
    postController.createPost
);

router.get('/:id', postIdValidator, validate, postController.getPostById);

router.put('/:id', upload.array('images', 5),
    postIdValidator,
    updatePostValidator,
    validate,
    postController.updatePost
);
router.delete('/:id', postIdValidator, validate, postController.deletePost);

router.post('/:id/request-access', postIdValidator, validate, postController.requestAccess);

export { router };