import { config } from '@root/config';
import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';
import { ServerError } from '@global/helpers/error-handler';
import { findIndex } from 'lodash';

const log: Logger = config.createLogger('messageCache');

export class MessageCache extends BaseCache {
  constructor() {
    super('messageCache');
  }

  public async addChatListToCache(senderId: string, receiverId: string, conversationId: string): Promise<void> {
    try {
      if(!this.client.isOpen){
        await this.client.connect();
      }
      const userChatList = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
      if(userChatList.length === 0){ // if user's chat doesn't exist in the chat list
        await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({ receiverId, conversationId })); // add data to chat list to the right, otherwise we have to sort data when we retrieve chat list
      } else {
        const receiverIndex: number = findIndex(userChatList, (listItem: string) => listItem.includes(receiverId));
        if(receiverIndex < 0) { // if user has no chat with the receiver or user is sending message for the first time to that receiver
          await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({ receiverId, conversationId })); // add data to chat list to the right, otherwise we have to sort data when we retrieve chat list
        }
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again');
    }
  }
}
