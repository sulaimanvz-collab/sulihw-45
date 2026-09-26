import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "../features/users/usersSlice";
import { recipesReducer } from "../features/recipes/recipesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    recipes: recipesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
