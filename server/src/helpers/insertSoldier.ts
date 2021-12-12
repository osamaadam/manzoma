import { DateTime } from "luxon";
import { getMoahel } from "../routes/formData";
import { executeQuery } from "./executeQuery";

export const insertSoldier = async ({
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
}) => {
  const constantFields = {
    "[user]": "مركز تد الاشارة رقم2 _ مستخدم1",
    unit_fk: "0",
    psychological: "0",
    military_status: "2",
    current_weapon_fk: "16",
    current_degree: 1,
    enha_state: 0,
    khedma_state: "مجند",
    fea_c: 5,
    technical_evaluation: 1,
    mrkz_tadreeb: "1167205002",
    daraga_saek: 0,
  };

  // Validations
  if (national_no.toString().length !== 14)
    throw new Error("the national id isn't 14 characters long");
  else if (military_no.toString().length !== 13)
    throw new Error("the military number isn't 13 characters long");

  const birth_date = getBirthDateFromNationalId(national_no);
  const moahel_code = await getMoahelFromMilitaryNumber(military_no);
  if (!moahel_code) throw new Error("moahel not found");
  const tasreh_date = calculateTasrehDate(mrhla, moahel_code, tagneed_factor);

  const serial =
    segl_no >= 10 ? 10 : segl_no - +String(segl_no).substring(0, 2);

  const queryString = `
    insert into src_soldiers (
      ${Object.keys(constantFields).join(",\n  ")},
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
      major_fk,
      moahel_code,
      tagneed_date,
      tasgeel_date,
      birth_date,
      tasreh_date,
      serial,
      tagneed_factor,
      updat)
    values (
      ${Object.values(constantFields)
        .map((val) => (typeof val === "string" ? `'${val}'` : val))
        .join(",\n  ")},
      '${address}',
      ${blood_type},
      ${center_code},
      ${etgah},
      '${governorate_fk}',
      '${health}',
      '${marital_state}',
      ${mehna},
      '${military_no}',
      '${mrhla}',
      '${national_no}',
      '${rel_address}',
      '${rel_degree}',
      '${rel_name}',
      ${religion_code},
      ${segl_no},
      '${solasy_no}',
      '${soldier_name}',
      '${major_fk}',
      '${moahel_code}',
      #${DateTime.fromFormat(tagneed_date, "d/M/yyyy").toISODate()}#,
      #${DateTime.fromFormat(tasgeel_date, "d/M/yyyy").toISODate()}#,
      #${DateTime.fromFormat(birth_date, "d/M/yyyy").toISODate()}#,
      #${DateTime.fromFormat(tasreh_date, "d/M/yyyy").toISODate()}#,
      ${serial},
      ${tagneed_factor},
      now())
  `;

  return executeQuery(queryString);
};

const getBirthDateFromNationalId = (nationalId: string | number) => {
  const birthDate = DateTime.fromFormat(
    String(nationalId).substring(1, 7),
    "yyMMdd"
  ).toFormat("dd/MM/yyyy");

  return birthDate;
};

const getMoahelFromMilitaryNumber = async (militaryNumber: string | number) => {
  const MOAHELS = await getMoahel();

  const moahelId = String(militaryNumber)[5];

  return MOAHELS.find((moahel) => +moahel.id === +moahelId)?.id;
};

export const calculateTasrehDate = (
  marhla: string | number,
  moahelId: number,
  tagneedFactorId: number
) => {
  const year = +String(marhla).substring(0, 4);
  const phase = +String(marhla).substring(4) as 1 | 2 | 3 | 4;

  const VALID_PHASES = [1, 2, 3, 4];
  if (!VALID_PHASES.includes(phase)) {
    throw new Error("invalid phase");
  }

  const phaseMap = {
    1: 3,
    2: 6,
    3: 9,
    4: 12,
  };

  const startDate = DateTime.fromFormat(
    `01/${phaseMap[phase]}/${year}`,
    "d/M/yyyy"
  );

  const normalFactors = [1, 3, 5, 6, 7, 9];

  let tasreehDate: DateTime = DateTime.now();

  switch (+moahelId) {
    case 0:
      // عادة
      tasreehDate = startDate.plus({ years: 3 });
      break;
    case 1:
      // متوسطة
      tasreehDate = startDate.plus({ years: 2 });
      break;
    case 2:
      // عليا
      tasreehDate = startDate.plus({ years: 1 });
      break;
    case 8:
      // فوق متوسطة
      tasreehDate = startDate.plus({ years: 1, months: 6 });
      break;
    default:
      throw new Error("invalid moahel");
  }

  if (!normalFactors.includes(+tagneedFactorId))
    tasreehDate = tasreehDate.plus({ months: 2 });

  return tasreehDate.toFormat("dd/MM/yyyy");
};
