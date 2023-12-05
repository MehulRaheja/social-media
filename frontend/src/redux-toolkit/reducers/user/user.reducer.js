import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  profile: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.profile = profile;
      state.token = token;
    },
    clearUser: (state) => {
      state.profile = null;
      state.token = '';
    },
    updateUserProfile: (state, action) => {
      state.profile = action.payload;
    }
  }
});

export const { addUser, clearUser, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
