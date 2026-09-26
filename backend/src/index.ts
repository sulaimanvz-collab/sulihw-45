import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import usersRouter from "./routes/users.js";
import recipesRouter from "./routes/recipes.js";
import commentsRouter from "./routes/comments.js";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);
app.use("/comments", commentsRouter);

const run = async () => {
  await mongoose.connect("mongodb://localhost/recipes-app");

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
