import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';
import { find } from 'lodash';

const log: Logger = config.createLogger('reactionsCache');

export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionsCache');
  }

  // we will push reactions into a list of reactions of a post, LPUSH is used to push in the beginning and RPUSH is used to push in the end of the list
  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReactions: IReactions,
    type: string,
    previousReaction: string
  ): Promise<void> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      }

      if(previousReaction){ // if there is previous reaction then we will remove it first
        this.removePostReactionFromCache(key, reaction.username, postReactions);
      }

      if (type) { // if there is type then we will add the reaction
        await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction)); // list in redis accepts data in string so we have to stringify it first
        await this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions)); // update the post's reactions field after adding reaction
      }

    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async removePostReactionFromCache( key: string, username: string, postReactions: IReactions ): Promise<void> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      }
      // LRANGE: to get data from the redis list
      // ZRANGE: to get data from the redis hashmap
      const resposnse: string[] = await this.client.LRANGE(`reactions:${key}`, 0, -1); // to get all the data from the list
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction: IReactionDocument = this.getPreviousReaction(resposnse, username) as IReactionDocument;
      multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction)); // LREM is used to remove an string from a redis list
      await multi.exec();

      await this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions));
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getReactionsFromCache(postId: string): Promise<[IReactionDocument[], number]> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      }
      // LLEN is used to get length of the list in redis
      const reactionsCount: number = await this.client.LLEN(`reactions:${postId}`);

      // LRANGE: to get data from the redis list
      // ZRANGE: to get data from the redis hashmap
      const resposnse: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1); // to get all the data from the list
      const list: IReactionDocument[] = [];
      for(const item of resposnse){
        list.push(Helpers.parseJson(item));
      }
      return resposnse.length ? [list, reactionsCount] : [[], 0];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getSingleReactionByUsernameFromCache(postId: string, username: string): Promise<[IReactionDocument, number] | []> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      }
      // LRANGE: to get data from the redis list
      // ZRANGE: to get data from the redis hashmap
      const resposnse: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1); // to get all the data from the list
      const list: IReactionDocument[] = [];
      for(const item of resposnse){
        list.push(Helpers.parseJson(item));
      }
      const result: IReactionDocument = find(list, (listItem: IReactionDocument) => {
        return listItem?.postId === postId && listItem?.username === username;
      }) as IReactionDocument;

      return result ? [result, 1] : [];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  private getPreviousReaction(response: string[], username: string): IReactionDocument | undefined {
    const list: IReactionDocument[] = [];
    for(const item of response) {
      list.push(Helpers.parseJson(item) as IReactionDocument);
    }
    return find(list, (listItem: IReactionDocument) => {
      return listItem.username === username;
    });
  }
}
