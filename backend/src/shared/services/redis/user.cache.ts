import { IUserDocument } from '@user/interfaces/user.interface';
import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';

const log: Logger = config.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      username,
      email,
      avatarColor,
      uId,
      postsCount,
      work,
      school,
      quote,
      location,
      blocked,
      blockedBy,
      followersCount,
      followingCount,
      notifications,
      social,
      bgImageVersion,
      bgImageId,
      profilePicture,
    } = createdUser;
    const firstList: string[] = [
      '_id', `${_id}`,
      'username', `${username}`,
      'email', `${email}`,
      'avatarColor', `${avatarColor}`,
      'uId', `${uId}`,
      'postsCount', `${postsCount}`,
      'createdAt', `${createdAt}`

    ];
    const secondList: string[] = [
      'blocked', `${JSON.stringify(blocked)}`,
      'blockedBy', `${JSON.stringify(blockedBy)}`,
      'followersCount', `${followersCount}`,
      'followingCount', `${followingCount}`,
      'notifications', `${JSON.stringify(notifications)}`,
      'social', `${JSON.stringify(social)}`,
      'profilePicture', `${profilePicture}`,
    ];
    const thirdList: string[] = [
      'work', `${work}`,
      'school', `${school}`,
      'quote', `${quote}`,
      'location', `${location}`,
      'bgImageVersion', `${bgImageVersion}`,
      'bgImageId', `${bgImageId}`,
    ];
    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}`});
      await this.client.HSET(`users: ${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. try again.');
    }
  }
}
// by using ZADD we can get all the user properties from redis at the same time. by default redis give one property at a time from hset
