// messageSlice.ts  
import { createSlice } from '@reduxjs/toolkit';
import { MessageState } from '@/types';

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default messageSlice.reducer;
