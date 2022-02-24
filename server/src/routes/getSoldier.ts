import { Router } from "express";
import logger from "../logger";
import { query } from "../helpers/query";

interface BasicRow {
  soldier_name: string;
  tasgeel_date: string;
  segl_no: number;
  address: string;
  military_no: string;
  national_no: string;
  moahel_name: string;
  gov_name: string;
  major_name: string;
  blood_type: string;
  markaz: string;
  deg_name: string;
  religion_name: string;
  fea_name: string;
  tagneed_factor_name: string;
}

const router = Router();

router.get("/soldier", async (req, res) => {
  const { segl_no, national_no, military_no } = req.query;

  const whereClause = constructWhere(
    segl_no?.toString(),
    military_no?.toString(),
    national_no?.toString()
  );

  if (!whereClause) {
    res.status(400).send("no query parameter provided");
    return;
  }

  const sqlQuery = `
    select top 1
        soldier_name,
        format(tasgeel_date, 'short date') as tasgeel_date,
        segl_no,
        address,
        military_no,
        national_no,
        moahel_name,
        gov_name,
        major_name,
        b.name as blood_type,
        mark.markaz,
        deg.deg_name,
        rel.name as religion_name,
        fea.fea_name,
        tag.tagneed_factor_name
      from (((((((((
        src_soldiers s
        left join moahel_type m on m.moahel_code = s.moahel_code)
        left join governorate g on g.gov_no = s.governorate_fk)
        left join major maj on maj.major_no = s.major_fk)
        left join blood_type b on b.code = s.blood_type)
        left join markaz mark on mark.markaz_code = s.center_code)
        left join degree deg on int(deg.degree_code) = s.current_degree)
        left join religion rel on rel.code = s.religion_code)
        left join fea on fea.fea_code = s.fea_c)
        left join tagneed_factor tag on tag.tagneed_factor = s.tagneed_factor)
      ${whereClause}
  `;

  try {
    const soldier = await query<BasicRow[]>(sqlQuery);
    if (soldier?.length) res.json(soldier);
    else res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

const constructWhere = (
  segl_no?: string,
  military_no?: string,
  national_no?: string
) => {
  segl_no = segl_no?.trim();
  military_no = military_no?.trim();
  national_no = national_no?.trim();
  if (!segl_no?.length && !military_no?.length && !national_no?.length) {
    return null;
  }

  let clauses: string[] = [];

  if (segl_no?.length) clauses.push(`segl_no = ${segl_no}`);

  if (military_no?.length) clauses.push(`military_no = '${military_no}'`);

  if (national_no?.length) clauses.push(`national_no = '${national_no}'`);

  return `where ${clauses.join(" and ")}`;
};

export default router;
