import { Router, Request, Response } from "express";
import { Recipe } from "../models/Recipe.js";
import { auth, AuthRequest } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const filter = req.query.user ? { user: req.query.user as string } : {};
    const recipes = await Recipe.find(filter).populate("user", "username");
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "user",
      "username",
    );
    if (!recipe) return res.status(404).send({ error: "Recipe not found" });
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/",
  auth,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file)
        return res.status(400).send({ error: "Image is required" });

      const recipe = new Recipe({
        user: req.user._id,
        title: req.body.title,
        recipe: req.body.recipe,
        image: "uploads/" + req.file.filename,
      });

      await recipe.save();
      res.status(201).send(recipe);
    } catch (error) {
      res.status(400).send(error);
    }
  },
);

router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send({ error: "Recipe not found" });

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.send({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
