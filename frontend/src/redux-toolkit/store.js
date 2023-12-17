import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from '@redux/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@redux/reducers/notifications/notification.reducer';
import modalReducer from '@redux/reducers/modal/modal.reducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationReducer,
    modal: modalReducer
  }
});
