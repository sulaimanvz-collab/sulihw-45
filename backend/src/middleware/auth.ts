import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ error: "No token provided" });

  const user = await User.findOne({ token });
  if (!user) return res.status(401).send({ error: "Unauthorized" });

  req.user = user;
  next();
};
