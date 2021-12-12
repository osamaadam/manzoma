import { Router } from "express";
import { calculateTasrehDate } from "../helpers/insertSoldier";

const router = Router();

router.get("/", (req, res) => {
  res.send("PONG!");
});

router.get("/print", (req, res) => {
  res.send(calculateTasrehDate(20201, 2, 7));
});

export default router;
