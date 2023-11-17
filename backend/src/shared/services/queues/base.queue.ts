import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface';
import { IPostJobData } from '@post/interfaces/post.interface';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ICommentJob } from '@comment/interfaces/comment.interface';
import { IFollowerJobData } from '@follower/interfaces/follower.interface';
import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { IFileImageJobData } from '@image/interfaces/image.interface';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';
// import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
// import BullMQ from 'bullmq';

type IBaseJobData = IAuthJob
  | IEmailJob
  | IPostJobData
  | IReactionJob
  | ICommentJob
  | IFollowerJobData
  | INotificationJobData
  | IFileImageJobData
  | IChatJobData
  | IMessageData
  | IUserJob;

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_CLIENT}`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)]; // to remove duplicate queues
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    // creating a bull board
    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });

    this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    // when job completes its process successfully, we will get this message in console
    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    // when job is stalled, we will get this message in console
    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  // this method will add jobs to the queue
  protected addJob(name: string, data: IBaseJobData): void {
    // attempts: how many times we want to attempt if a job fails and
    // backoff(delay): how many seconds we wait before second attempt to add job
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }

  // method to process jobs inside the queue
  // concurrency: how many jobs we want to process at a time
  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
