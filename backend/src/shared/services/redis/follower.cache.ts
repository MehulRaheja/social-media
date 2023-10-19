import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';

const log: Logger = config.createLogger('followersCache');

export class FollowerCache extends BaseCache {
  constructor() {
    super('followersCache');
  }

  public async saveFollowerToCache(key: string, value: string): Promise<void> {
    try {
      if(!this.client.isOpen){
        await this.client.connect();
      }
      await this.client.LPUSH(key, value); // add followee _id to the followers list
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async removeFollowerFromCache(key: string, value: string): Promise<void> {
    try {
      if(!this.client.isOpen){
        await this.client.connect();
      }
      await this.client.LREM(key, 1, value); // remove followee _id to the followers list
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async updateFollowersCountInCache(userId: string, prop: string, value: number): Promise<void> {
    try {
      if(!this.client.isOpen){
        await this.client.connect();
      }
      await this.client.HINCRBY(`users:${userId}`, prop, value); // HINCRBY method in redis increases the value of numerical field by a particular number, it is used here to increase or decrease the follower or followee count conditionally
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
