import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Token is not provided");
  }

  try {
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as DecodedToken;

    req.user = verifiedToken;

    return next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
