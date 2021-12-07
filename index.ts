import adodb from "node-adodb";
import { resolve } from "path";
import { writeFile } from "fs/promises";

const CONNECTION_STRING = `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${resolve(
  "E:",
  "test.mdb"
)};Persist Security Info=False;`;

const query = async () => {
  try {
    const access = adodb.open(CONNECTION_STRING, false);

    const soldiers = await access.query(`
      select 
        soldier_name,
        format(tasgeel_date, 'short date') as tasgeel_date,
        segl_no,
        address,
        military_no,
        national_no,
        moahel_name,
        gov_name,
        major_name,
        b.name,
        mark.markaz,
        deg.deg_name,
        rel.name as religion,
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
      where tasgeel_date = #11/11/2021#
      order by segl_no asc
    `);

    await writeFile(
      resolve(__dirname, "res.json"),
      JSON.stringify(soldiers, null, 2)
    );
  } catch (err) {
    console.error(err);
  }
};

query();
