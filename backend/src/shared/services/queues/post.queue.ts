import { IPostJobData } from '@post/interfaces/post.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { postWorker } from '@worker/post.worker';

class PostQueue extends BaseQueue {
  constructor() {
    super('posts');
    this.processJob('addPostToDB', 5, postWorker.savePostToDB); // this method will process job in the queue
  }

  public addPostJob(name: string, data: IPostJobData): void {
    // this method will add job to the queue
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();
