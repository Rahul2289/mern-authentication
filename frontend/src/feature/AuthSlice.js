import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: { isLogedIn: false },
  reducers: {
    logIn(state) {
      state.isLogedIn = true;
    },
    Logout(state) {
      state.isLogedIn = false;
    },
  },
});

export const AuthActions = AuthSlice.actions;
export default AuthSlice.reducer;
