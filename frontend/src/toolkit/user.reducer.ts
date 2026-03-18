import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  email: string;
}

interface User {
  user: UserState | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}
const initialState: User = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user: (state, action) => {
      state.user = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = true;
      state.token = null;
    },
  },
});

export const { user, setUser, setLoading, logOut, setToken } =
  userSlice.actions;

export default userSlice.reducer;
