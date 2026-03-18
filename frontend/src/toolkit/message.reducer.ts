import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  onlineUsers: string[];
}

const initialState: ChatState = {
  onlineUsers: [],
};

export const messageSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = messageSlice.actions;
export default messageSlice.reducer;
