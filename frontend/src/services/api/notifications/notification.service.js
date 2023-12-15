import axios from '@services/axios';

class NotificationService {
  async getUserNotifications() {
    const response = await axios.get('/notifications');
    return response;
  }
}

export const notificationService = new NotificationService();
