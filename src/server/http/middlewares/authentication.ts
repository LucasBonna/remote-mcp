import type { NextFunction, Request, Response } from "express";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  try {
    const apiKey = process.env.API_KEY;

    if (token !== apiKey) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
