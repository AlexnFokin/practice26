import { CommentController } from '@/controllers/comment/comment.controller';
import { MediaController } from '@/controllers/media/media.controller';
import { PostController } from '@/controllers/post/post.controller';
import { CommentRepository } from '@/repositories/comment/comment.repository';
import { PostRepository } from '@/repositories/post/post.repository';
import { PostAccessRequestRepository } from '@/repositories/postRequestAccess/postRequestAccess.repository';
import { CommentService } from '@/services/comment/comment.service';
import { MediaService } from '@/services/media/media.service';
import { PostService } from '@/services/post/post.service';

class Container {
    private services = new Map<string, any>();
    private controllers = new Map<string, any>();
    private repositories = new Map<string, any>();

    constructor() {
        this.register();
    }

    private register() {
        // Repositories
        this.repositories.set('postRepository', new PostRepository());
        this.repositories.set('commentRepository', new CommentRepository());
        this.repositories.set('postAccessRequestRepository', new PostAccessRequestRepository());

        // Services
        this.services.set('commentService', new CommentService(this.repositories.get('commentRepository')))

        this.services.set('mediaService', new MediaService());

        this.services.set('postService', new PostService(
            this.repositories.get('postRepository'),
            this.services.get('commentService'),
            this.repositories.get('postAccessRequestRepository'),
        ));

        // Controllers
        this.controllers.set(
            'postController',
            new PostController(this.services.get('postService'))
        );
        this.controllers.set(
            'commentController',
            new CommentController(this.services.get('commentService'))
        );
        this.controllers.set(
            'mediaController',
            new MediaController(this.services.get('mediaService'))
        );
    }

    getController<T>(name: string): T {
        const controller = this.controllers.get(name);
        if (!controller) {
            throw new Error(`Controller ${name} not found`);
        }
        return controller as T;
    }

    getService<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service as T;
    }

    getRepository<T>(name: string): T {
        const repository = this.repositories.get(name);
        if (!repository) {
            throw new Error(`Repository ${name} not found`);
        }
        return repository as T;
    }
}

const container = new Container();
export { container };