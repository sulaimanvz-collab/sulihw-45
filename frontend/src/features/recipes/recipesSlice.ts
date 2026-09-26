import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Recipe {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  title: string;
  image: string;
  recipe: string;
}

interface RecipesState {
  items: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  items: [],
  currentRecipe: null,
  loading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.items = action.payload;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRecipes, setCurrentRecipe, setLoading, setError } =
  recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
