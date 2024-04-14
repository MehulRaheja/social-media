import '@pages/social/chat/Chat.scss';

import useEffectOnce from '@hooks/useEffectOnce';
import { getConversationList } from '@redux/api/chat';
import { useDispatch, useSelector } from 'react-redux';
import ChatList from '@components/chat/list/ChatList';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList());
  });
  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div className="private-chat-wrapper-content-side">
          <ChatList />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          {selectedChatUser || chatList.length ? <div>Chat window</div> : null}
          {!selectedChatUser && !chatList.length ? (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
