import { Router } from "express";
import { query } from "../helpers/query";

const router = Router();

router.get("/major", async (req, res) => {
  const { moahelId } = req.query;
  if (!moahelId) res.status(400).send("no moahel id provided");
  else {
    try {
      const majors = await getMajor(+moahelId);
      res.json(majors);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }
});

router.get("/markaz", async (req, res) => {
  const { govId } = req.query;
  if (!govId) res.status(400).send("no governorate id provided");
  else {
    try {
      const marakez = await getMarkaz(+govId);
      res.json(marakez);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const promises = [
      getMoahel(),
      getGov(),
      getHealth(),
      getBloodType(),
      getReligion(),
      getMaritalState(),
      getTagneedFactor(),
      getEtgah(),
      getMehna(),
      getDriversLicense(),
    ];

    const [
      moahel,
      govs,
      health,
      bloodTypes,
      religions,
      maritalStates,
      tagneedFactor,
      etgah,
      mehna,
      driversLicense,
    ] = await Promise.all(promises);

    res.send({
      moahel,
      govs,
      health,
      bloodTypes,
      religions,
      maritalStates,
      tagneedFactor,
      etgah,
      mehna,
      driversLicense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export const getMoahel = async () => {
  const queryString = `
    select moahel_code as id, moahel_name as name
    from moahel_type
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getGov = async () => {
  const queryString = `
    select gov_no as id, gov_name as name
    from governorate
    where gov_name is not null
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getMajor = async (moahelId: number) => {
  const queryString = `
    select major_no as id, major_name as name, moahel_name as moahel, moahel_code as moahelId
    from (major m
          left join moahel_type mt on m.moahel_type = mt.moahel_code)
    where int(m.moahel_type) = ${moahelId}
  `;

  return query<
    { id: number; name: string; moahel: string; moahelId: number }[]
  >(queryString);
};

const getHealth = async () => {
  const queryString = `
    select code as id, text as name
    from health
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getBloodType = async () => {
  const queryString = `
    select code as id, name
    from blood_type
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getMarkaz = async (govId: number) => {
  const queryString = `
    select markaz_code as id, mohafza_code as govId, markaz as name, gov_name as gov
    from (markaz m 
      left join governorate g on int(m.mohafza_code) = int(g.gov_no))
    where m.mohafza_code = ${govId}
  `;

  return query<{ id: number; name: string; gov: string; govId: number }[]>(
    queryString
  );
};

const getReligion = async () => {
  const queryString = `
    select code as id, name
    from religion
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getMaritalState = async () => {
  const queryString = `
    select state_code as id, state_name as name
    from marital_state
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getTagneedFactor = async () => {
  const queryString = `
    select tagneed_factor as id, tagneed_factor_name as name
    from tagneed_factor
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getEtgah = async () => {
  const queryString = `
    select \`etgah c\` as id, etgah as name
    from etgah
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getMehna = async () => {
  const queryString = `
    select job_c as id, job_name as name
    from mehna
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

const getDriversLicense = async () => {
  const queryString = `
    select daraga_code as id, daraga_name as name
    from daraga_saek
  `;

  return query<{ id: number; name: string }[]>(queryString);
};

export default router;
