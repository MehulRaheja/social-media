import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ReactionCache } from '@service/redis/reaction.cache';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { addReactionSchema } from '@reaction/schemes/reactions';

const reactionCache: ReactionCache = new ReactionCache();

export class Add {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avatarColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as unknown as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);

    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' });
  }
}
