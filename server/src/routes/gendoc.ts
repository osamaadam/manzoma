import { Packer } from "docx";
import { Router } from "express";
import { documentGenerator, Soldier } from "../helpers/documentGenerator";
import { query } from "../helpers/query";

const router = Router();

router.get("/docx", async (req, res) => {
  const soldiers = await getSoldiers();
  const doc = documentGenerator(soldiers);

  const docxBuf = await Packer.toBuffer(doc);

  const filename = `${soldiers.length}-soldiers.docx`;

  res.setHeader("filename", filename);
  res.attachment(filename);

  res.send(docxBuf);
});

const getSoldiers = async () => {
  const sqlQuery = `
    select
      soldier_name as name,
      solasy_no,
      segl_no,
      national_no,
      gov_name as governorate,
      birth_date,
      mantek_tagneed as tagneed,
      moahel_name as moahel
      from (((
        src_soldiers s
        left join moahel_type m on s.moahel_code = m.moahel_code)
        left join governorate g on s.governorate_fk = g.gov_no)
      )
      order by segl_no asc
  `.trim();

  return await query<Soldier[]>(sqlQuery);
};

export default router;
