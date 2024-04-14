import { getConversationList } from '@redux/api/chat';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatList: [],
  selectedChatUser: null,
  isLoading: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addToChatList: (state, action) => {
      const { isLoading, chatList } = action.payload;
      state.chatList = [...chatList];
      state.isLoading = isLoading;
    },
    setSelectedChatUser: (state, action) => {
      const { isLoading, selectedChatUser } = action.payload;
      state.selectedChatUser = selectedChatUser;
      state.isLoading = isLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const { list } = action.payload;
      state.isLoading = false;
      state.chatList = [...list];
    });
    builder.addCase(getConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToChatList, setSelectedChatUser } = chatSlice.actions;
export default chatSlice.reducer;
