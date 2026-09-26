import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface UsersState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  loginLoading: false,
  registerLoading: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    unsetUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, unsetUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
