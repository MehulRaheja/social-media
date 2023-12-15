import { notificationService } from '@services/api/notifications/notification.service';
import { socketService } from '@services/socket/socket.service';
import { cloneDeep, find, findIndex, remove, sumBy } from 'lodash';
import { Utils } from '@services/utils/utils.service';

export class NotificationUtils {
  static socketIONotification(profile, notifications, setNotifications, type, setNotificationsCount) {
    socketService?.socket?.on('insert notification', (data, userToData) => {
      if (profile?._id === userToData.userTo) {
        notifications = [...data];
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
            notifications,
            setNotificationsCount
          );
          setNotifications(mappedNotifications);
        }
      }
    });

    socketService?.socket?.on('update notification', (notificationId) => {
      notifications = cloneDeep(notifications);
      const notificationData = find(notifications, (notification) => notification._id === notificationId);
      if (notificationData) {
        const index = findIndex(notifications, (notification) => notification._id === notificationId);
        notificationData.read = true;
        notifications.splice(index, 1, notificationData); // replace object at index with notificationData
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
            notifications,
            setNotificationsCount
          );
          setNotifications(mappedNotifications);
        }
      }
    });

    socketService?.socket?.on('delete notification', (notificationId) => {
      notifications = cloneDeep(notifications);
      remove(notifications, { _id: notificationId });
      if (type === 'notificationPage') {
        setNotifications(notifications);
      } else {
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
          notifications,
          setNotificationsCount
        );
        setNotifications(mappedNotifications);
      }
    });
  }

  static mapNotificationDropdownItems(notificationData, setNotificationsCount) {
    const items = [];
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification?.topText ? notification.topText : notification?.message,
        subText: notification?.createdAt,
        createdAt: notification?.createdAt,
        username: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        avatarColor: notification?.userFrom ? notification?.userFrom.avatarColor : notification?.avatarColor,
        profilePicture: notification?.userFrom ? notification?.userFrom.profilePicture : notification?.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
            ? notification?.gifUrl
            : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        notificationType: notification?.notificationType
      };
      items.push(item);
    }

    const count = sumBy(items, (selectedNotification) => {
      return !selectedNotification.read ? 1 : 0;
    });
    setNotificationsCount(count);
    return items;
  }

  static async markMessageAsRead(messageId, notification, setNotificationDialogContent) {
    await notificationService.markNotificationAsRead(messageId);
  }
}
