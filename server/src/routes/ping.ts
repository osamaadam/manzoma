import { Router } from "express";
import { calculateTasrehDate } from "../helpers/insertSoldier";

const router = Router();

router.get("/", (req, res) => {
  res.send("PONG!");
});

router.get("/print", (req, res) => {
  res.send(req.url);
});

export default router;
