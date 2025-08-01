import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import chatSlice from './slices/chatSlice';
import messageSlice from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
    message: messageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
