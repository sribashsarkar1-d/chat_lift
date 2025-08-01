// chatSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { ChatState } from '@/types';

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default chatSlice.reducer;

