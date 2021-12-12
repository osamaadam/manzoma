import { Router } from "express";
import { insertSoldier } from "../helpers/insertSoldier";

const router = Router();

router.post("/", async (req, res) => {
  const {
    address,
    blood_type,
    center_code,
    etgah,
    governorate_fk,
    health,
    marital_state,
    mehna,
    military_no,
    mrhla,
    national_no,
    rel_address,
    rel_degree,
    rel_name,
    religion_code,
    segl_no,
    solasy_no,
    soldier_name,
    tagneed_date,
    tagneed_factor,
    tasgeel_date,
    major_fk,
  }: {
    soldier_name: string;
    address: string;
    mrhla: string | number;
    military_no: string | number;
    tagneed_date: string;
    governorate_fk: number;
    solasy_no: string;
    health: number;
    segl_no: number;
    blood_type: number;
    tasgeel_date: string;
    center_code: number;
    religion_code: number;
    marital_state: number;
    national_no: string | number;
    rel_name: string;
    rel_degree: string;
    rel_address: string;
    tagneed_factor: number;
    etgah: number;
    mehna: string | null;
    major_fk: string | number;
  } = req.body;

  try {
    await insertSoldier({
      address,
      blood_type,
      center_code,
      etgah,
      governorate_fk,
      health,
      marital_state,
      mehna,
      military_no,
      mrhla,
      national_no,
      rel_address,
      rel_degree,
      rel_name,
      religion_code,
      segl_no,
      solasy_no,
      soldier_name,
      tagneed_date,
      tagneed_factor,
      tasgeel_date,
      major_fk,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default router;
