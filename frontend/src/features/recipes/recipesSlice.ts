import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe, Comment } from "../../types";

interface RecipesState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  comments: Comment[];
  fetchLoading: boolean;
  createLoading: boolean;
}

const initialState: RecipesState = {
  recipes: [],
  currentRecipe: null,
  comments: [],
  fetchLoading: false,
  createLoading: false,
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
    setFetchLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchLoading = action.payload;
    },
  },
});

export const { setRecipes, setCurrentRecipe, setComments, setFetchLoading } =
  recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
