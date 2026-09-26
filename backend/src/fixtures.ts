import mongoose from "mongoose";
import crypto from "crypto";
import { User } from "./models/User.js";
import { Recipe } from "./models/Recipe.js";
import { Comment } from "./models/Comment.js";

const run = async () => {
  await mongoose.connect("mongodb://localhost/recipes-app");

  const db = mongoose.connection;
  try {
    await db.dropDatabase();
  } catch (e) {
    console.log("Database was empty");
  }

  const [user1, user2] = await User.create(
    {
      username: "John Doe",
      password: "123",
      token: crypto.randomUUID(),
    },
    {
      username: "Jane Smith",
      password: "123",
      token: crypto.randomUUID(),
    },
  );

  const [recipe1, recipe2] = await Recipe.create(
    {
      user: user1._id,
      title: "Плов",
      recipe: "Традиционный узбекский плов с рисом и мясом.",
      image: "/uploads/plov.jpg",
    },
    {
      user: user1._id,
      title: "Лагман",
      recipe: "Вкусная домашняя лапша с мясом и овощами.",
      image: "/uploads/lagman.jpg",
    },
  );

  await Comment.create({
    user: user2._id,
    recipe: recipe1._id,
    text: "Очень вкусный плов! Спасибо за рецепт!",
  });

  console.log("Fixtures loaded successfully!");
  await mongoose.disconnect();
};

run().catch(console.error);
