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

  const [user1, user2, remy, soma, sanji, barinov] = await User.create(
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
    {
      username: "Remy",
      password: "123",
      token: crypto.randomUUID(),
    },
    {
      username: "Yukihira Soma",
      password: "123",
      token: crypto.randomUUID(),
    },
    {
      username: "Sanji",
      password: "123",
      token: crypto.randomUUID(),
    },
    {
      username: "Виктор Баринов",
      password: "123",
      token: crypto.randomUUID(),
    },
  );

  const [
    recipePlov,
    recipeLagman,
    recipeRatatouille,
    recipeGotcha,
    recipeCurry,
    recipeSouffle,
  ] = await Recipe.create(
    {
      user: user1._id,
      title: "Плов",
      recipe: "Традиционный узбекский плов с рисом, бараниной и морковью.",
      image: "uploads/plov.png",
    },
    {
      user: user1._id,
      title: "Лагман",
      recipe: "Вкусная домашняя тянутая лапша с мясом и густым овощным соусом.",
      image: "uploads/lagman.png",
    },
    {
      user: remy._id,
      title: "Традиционный Рататуй",
      recipe:
        "Классическое провансальское овощное рагу из баклажанов, кабачков, томатов и соуса Конкассе.",
      image: "uploads/ratatouille.png",
    },
    {
      user: soma._id,
      title: "Фальшивое жаркое «Готча»",
      recipe:
        "Сочный рулет из картофельного пюре, обёрнутый хрустящим беконом и политый насыщенным соусом из красного вина.",
      image: "uploads/gotcha.png",
    },
    {
      user: soma._id,
      title: "Трансформирующийся карри-рис",
      recipe:
        "Ароматный карри со специальными кубиками застывшего бульона, которые тают от горячего риса.",
      image: "uploads/curry.png",
    },
    {
      user: sanji._id,
      title: "Морское суфле от Санджи",
      recipe:
        "Нежнейшее суфле из морепродуктов, приготовленное для восстановления сил экипажа.",
      image: "uploads/souffle.png",
    },
  );

  await Comment.create(
    {
      user: user2._id,
      recipe: recipePlov._id,
      text: "Очень вкусный плов! Спасибо за рецепт!",
    },
    {
      user: barinov._id,
      recipe: recipeRatatouille._id,
      text: "Огненно! Даже Антон Эго оценил бы такое блюдо!",
    },
    {
      user: remy._id,
      recipe: recipeGotcha._id,
      text: "Необычное сочетание картофеля и бекона, очень оригинально!",
    },
    {
      user: soma._id,
      recipe: recipeSouffle._id,
      text: "Отличная текстура! Но в следующий раз я приговлю ещё лучше!",
    },
  );

  console.log("Fixtures loaded successfully!");
  await mongoose.disconnect();
};

run().catch(console.error);
