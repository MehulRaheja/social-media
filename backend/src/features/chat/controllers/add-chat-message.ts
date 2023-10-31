import HTTP_STATUS from 'http-status-codes';
import { IMessageData, IMessageNotification } from '@chat/interfaces/chat.interface';
import { addChatSchema } from '@chat/schemes/chat';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { INotificationTemplate } from '@notification/interfaces/notification.interface';
import { notificationTemplate } from '@service/emails/templates/notifications/notification-template';
import { emailQueue } from '@service/queues/email.queue';
import { UserCache } from '@service/redis/user.cache';
import { socketIOChatObject } from '@socket/chat';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const userCache: UserCache = new UserCache();

export class Add {
  @joiValidation(addChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const {
      conversationId,
      receiverId,
      receiverUsername,
      receiverAvatarColor,
      receiverProfilePicture,
      body,
      gifUrl,
      isRead,
      selectedImage
    } = req.body;
    let fileUrl = '';
    const messageObjectId: ObjectId = new ObjectId();
    const conversationObjectId: ObjectId = !conversationId ? new ObjectId() : new mongoose.Types.ObjectId(conversationId);

    const sender: IUserDocument = await userCache.getUserFromCache(`${req.currentUser!.userId}`) as IUserDocument;

    if(selectedImage.length) {
      const result: UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
      if(!result?.public_id){
        throw new BadRequestError(result.message);
      }
      fileUrl = `https://res.cloudinary.com/dlft3yfad/image/upload/v${result.version}/${result.public_id}`;
    }

    const messageData: IMessageData = {
      _id: `${messageObjectId}`,
      conversationId: new mongoose.Types.ObjectId(conversationObjectId),
      receiverId,
      receiverAvatarColor,
      receiverProfilePicture,
      receiverUsername,
      senderUsername: `${req.currentUser!.username}`,
      senderId: `${req.currentUser!.userId}`,
      senderAvatarColor: `${req.currentUser!.avatarColor}`,
      senderProfilePicture: `${sender.profilePicture}`,
      body,
      isRead, // becomes true if sender and receiver are both on same chat page
      gifUrl,
      selectedImage: fileUrl,
      reaction: [],
      createdAt: new Date(),
      deleteForEveryone: false,
      deleteForMe: false
    };
    Add.prototype.emitSocketIOEvent(messageData);

    if(!isRead) {
      Add.prototype.messageNotification({
        currentUser: req.currentUser!,
        message: body,
        receiverName: receiverUsername,
        receiverId,
        messageData
      });
    }

    // 1 - add sender to chat list in cache
    // 2 - add receiver to chat list in cache
    // 3 - add message data to cache
    // 4 - add message to chat queue

    res.status(HTTP_STATUS.OK).json({ message: 'Message added', conversationId: conversationObjectId});
  }

  private emitSocketIOEvent(data: IMessageData): void {
    socketIOChatObject.emit('message received', data); // this will be used to update chat messages
    socketIOChatObject.emit('chat list', data); // this will be used to update chat list
  }

  private async messageNotification({ currentUser, message, receiverName, receiverId }: IMessageNotification): Promise<void> {
    const cachedUser: IUserDocument = await userCache.getUserFromCache(receiverId) as IUserDocument; // get receiver from the cache
    if(cachedUser.notifications.messages){// check if user has enabled to receive chat notifications
      const templateParams: INotificationTemplate = {
        username: receiverName,
        message,
        header: `Message notification from ${currentUser.username}`
      };
      const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
      emailQueue.addEmailJob('directMessageEmail', { receiverEmail: currentUser.email, template, subject: `You've received messages from ${currentUser.username}`});
    }
  }
}
