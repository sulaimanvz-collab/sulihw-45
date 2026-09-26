import { Router, Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { auth, AuthRequest } from "../middleware/auth.js";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password, token: crypto.randomUUID() });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/sessions", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.status(400).send({ error: "Wrong username or password" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(400).send({ error: "Wrong username or password" });

    user.token = crypto.randomUUID();
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/sessions", auth, async (req: AuthRequest, res: Response) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.send({ message: "Success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/google", async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email)
      return res.status(400).send({ error: "Google auth failed" });

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        username: payload.email.split("@")[0],
        password: crypto.randomUUID(),
        googleId: payload.sub,
      });
    }
    user.token = crypto.randomUUID();
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: "Google login failed" });
  }
});

export default router;
