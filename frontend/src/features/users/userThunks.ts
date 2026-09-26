import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import type { User } from "./usersSlice";

export interface RegisterReq {
  username: string;
  password: string;
}

export interface LoginReq {
  username: string;
  password: string;
}

export const registerUser = createAsyncThunk<User, RegisterReq>(
  "users/register",
  async (registerData) => {
    const response = await axiosApi.post<User>("/users", registerData);
    return response.data;
  },
);

export const loginUser = createAsyncThunk<User, LoginReq>(
  "users/login",
  async (loginData) => {
    const response = await axiosApi.post<User>("/users/sessions", loginData);
    return response.data;
  },
);

export const googleLogin = createAsyncThunk<User, string>(
  "users/googleLogin",
  async (credential) => {
    const response = await axiosApi.post<User>("/users/google", { credential });
    return response.data;
  },
);
