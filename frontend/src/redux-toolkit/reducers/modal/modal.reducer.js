import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: '',
  isOpen: false,
  feeling: '',
  image: '',
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false,
  gifModalIsOpen: false,
  reactionsModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
    },
    closeModal: (state) => {
      state.type = '';
      state.isOpen = false;
      state.feeling = '';
      state.image = '';
      state.data = null;
      state.feelingsIsOpen = false;
      state.openFileDialog = false;
      state.gifModalIsOpen = false;
      state.reactionsModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.deleteDialogIsOpen = false;
    },
    addPostFeeling: (state, action) => {
      const { feeling } = action.payload;
      state.feeling = feeling;
    },
    toggleImageModal: (state, action) => {
      state.openFileDialog = action.payload;
    },
    toggleVideoModal: (state, action) => {
      state.openVideoDialog = action.payload;
    },
    toggleFeelingModal: (state, action) => {
      state.feelingsIsOpen = action.payload;
    },
    toggleGifModal: (state, action) => {
      state.gifModalIsOpen = action.payload;
    },
    toggleReactionsModal: (state, action) => {
      state.reactionsModalIsOpen = action.payload;
    },
    toggleCommentsModal: (state, action) => {
      state.commentsModalIsOpen = action.payload;
    },
    toggleDeleteDialog: (state, action) => {
      const { data, toggle } = action.payload;
      state.deleteDialogIsOpen = toggle;
      state.data = data;
    }
  }
});
export const {
  openModal,
  closeModal,
  addPostFeeling,
  toggleImageModal,
  toggleVideoModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleReactionsModal,
  toggleCommentsModal,
  toggleDeleteDialog
} = modalSlice.actions;
export default modalSlice.reducer;
