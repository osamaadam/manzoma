import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../logger";

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqToken = req.headers.authorization?.split(" ")[1];

  if (!reqToken) return next();

  try {
    jwt.verify(reqToken, process.env.JWT_SECRET) as DecodedToken;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      logger.info("token expired, generating a new token");
      const { id, username } = jwt.decode(reqToken) as DecodedToken;
      const token = jwt.sign(
        {
          id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );
      res.setHeader("authorization", `Bearer ${token}`);
    }
  } finally {
    return next();
  }
};
