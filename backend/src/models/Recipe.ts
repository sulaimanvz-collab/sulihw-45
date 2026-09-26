import { Schema, model } from "mongoose";

const RecipeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  recipe: { type: String, required: true },
  image: { type: String, required: true },
});

export const Recipe = model("Recipe", RecipeSchema);
