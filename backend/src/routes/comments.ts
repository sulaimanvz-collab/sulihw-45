import { Router, Request, Response } from "express";
import { Comment } from "../models/Comment.js";
import { Recipe } from "../models/Recipe.js";
import { auth, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    if (!req.query.recipe)
      return res.status(400).send({ error: "Recipe ID is required" });
    const comments = await Comment.find({
      recipe: req.query.recipe as string,
    }).populate("user", "username");
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const comment = new Comment({
      user: req.user._id,
      recipe: req.body.recipe,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    const recipe = await Recipe.findById(comment.recipe);

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isRecipeOwner =
      recipe && recipe.user.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isRecipeOwner) {
      return res
        .status(403)
        .send({ error: "Forbidden: You cannot delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.send({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
