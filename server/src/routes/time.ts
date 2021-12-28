import { Router } from "express";
import { DateTime } from "luxon";

const router = Router();

router.get("/", (req, res) => {
  const curDate = DateTime.now().toISO({
    includeOffset: true,
  });
  res.send(curDate);
});

export default router;
