import { FollowerCache } from './../../../shared/services/redis/follower.cache';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { followerQueue } from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async follower(req: Request, res: Response): Promise<void>{
    const { followeeId, followerId } = req.params;
    // update count in cache
    const removeFollwerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${req.currentUser!.userId}`, followeeId);
    const removeFollweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followerId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1); // update followers count
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1); // update following count
    await Promise.all([removeFollwerFromCache, removeFollweeFromCache, followersCount, followeeCount]);

    // send data to queue
    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: `${followeeId}`,
      keyTwo: `${followerId}`
    });

    res.status(HTTP_STATUS.OK).json({message: 'Unfollowed user now'});
  }

}
