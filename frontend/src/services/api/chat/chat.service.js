import axios from '@services/axios';

class ChatService {
  async getConversationList() {
    const response = await axios.get('/chat/message/conversation-list');
    return response;
  }

  // to remove chat users
  async removeChatUsers(body) {
    const response = await axios.get('/chat/message/remove-chat-users', body);
    return response;
  }
}

export const chatService = new ChatService();
