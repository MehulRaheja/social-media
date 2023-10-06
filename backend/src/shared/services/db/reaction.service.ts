/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionModel } from '@reaction/models/reaction.schema';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';

const userCache: UserCache = new UserCache();

class ReactionService {
  public async addReactionDataToDB(reactionData: IReactionJob): Promise<void> {
    const { postId, userTo, userFrom, username, type, previousReaction, reactionObject } = reactionData;
    const updateReaction: [IUserDocument, IReactionDocument, IPostDocument] = await Promise.all([
      userCache.getUserFromCache(`${userTo}`),
      ReactionModel.replaceOne({ postId, type: previousReaction, username }, reactionObject, { upsert: true }), // replace old reaction document with new reaction document
      PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1,
            [`reactions.${type}`]: 1,
          }
        },
        { new: true }
      )
    ]) as unknown as [IUserDocument, IReactionDocument, IPostDocument];

    // send reaction notification
  }

  public async removeReactionDataFromDB(reactionData: IReactionJob): Promise<void> {
    const { postId, previousReaction, username } = reactionData;
    await Promise.all([
      ReactionModel.deleteOne({ postId, type: previousReaction, username }),
      PostModel.updateOne(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1
          },
        },
      )
    ]);
  }
}

export const reactionService: ReactionService = new ReactionService();
