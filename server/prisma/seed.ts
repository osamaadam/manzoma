import {
  Fasela,
  PrismaClient,
  Qualifaction,
  Religion,
  Soldier,
} from "@prisma/client";
import { query } from "../src/helpers/query";
import { removeArabicDialicts } from "../src/helpers/removeArabicDialicts";

const seed = async () => {
  const prisma = new PrismaClient();

  const religions = (
    await query<Religion[]>(`
    select
      code as id,
      name
    from religion
  `)
  ).map((religion) => ({
    ...religion,
    name: removeArabicDialicts(religion.name),
  }));

  const religionPromises = religions.map(
    async (religion) =>
      await prisma.religion.create({
        data: religion,
      })
  );

  try {
    await Promise.all(religionPromises);
    console.log("seeded religion table");
  } catch (err) {}

  const qualifications = (
    await query<Qualifaction[]>(`
      select
        moahel_code as id,
        moahel_name as name
      from moahel_type
    `)
  ).map((qual) => ({
    ...qual,
    id: +qual.id,
    name: removeArabicDialicts(qual.name),
  }));

  const qualPromises = qualifications.map(
    async (qual) =>
      await prisma.qualifaction.create({
        data: qual,
      })
  );

  try {
    await Promise.all(qualPromises);
    console.log("seeded qualification table");
  } catch (err) {}

  const govs = (
    await query<{ id: number; name: string; tagneed: string }[]>(`
    select
      gov_no as id,
      gov_name as name,
      mantek_tagneed as tagneed
    from governorate
    where gov_name is not null
  `)
  ).map((gov) => ({
    ...gov,
    id: +gov.id,
    name: removeArabicDialicts(gov.name),
    tagneed: gov.tagneed && removeArabicDialicts(gov.tagneed),
  }));

  const tagneeds = [
    ...new Set(govs.map((gov) => gov.tagneed).filter((tag) => tag)),
  ];

  try {
    const tagneedPromises = tagneeds.map(
      async (tag) =>
        await prisma.tagneed.create({
          data: {
            name: tag,
          },
        })
    );
    const tags = await Promise.all(tagneedPromises);
    console.log("seeded tagneed table");

    const govPromises = govs.map(
      async (gov) =>
        await prisma.gov.create({
          data: {
            id: gov.id,
            name: gov.name,
            tagneedId: tags.find((tag) => tag.name === gov.tagneed).id,
          },
        })
    );

    await Promise.all(govPromises);
    console.log("seeded gov table");
  } catch (err) {}

  try {
    const centers = (
      await query<
        {
          id: number;
          govid: number;
          name: string;
        }[]
      >(`
      select
        markaz_code as id,
        mohafza_code as govid,
        markaz as name
      from markaz
    `)
    ).map((center) => ({
      ...center,
      id: +center.id,
      govid: +center.govid,
      name: removeArabicDialicts(center.name),
    }));

    const centerPromises = centers.map(
      async (center) =>
        await prisma.center.create({
          data: {
            id: center.id,
            name: center.name,
            govId: center.govid,
          },
        })
    );

    await Promise.all(centerPromises);
    console.log("seeded center table");
  } catch (err) {}

  try {
    const tagneedFactors = (
      await query<{ id: number; name: string }[]>(`
        select
          tagneed_factor as id,
          tagneed_factor_name as name
        from tagneed_factor
      `)
    ).map((factor) => ({
      ...factor,
      id: +factor.id,
      name: removeArabicDialicts(factor.name),
    }));

    const factorPromises = tagneedFactors.map(
      async (factor) =>
        await prisma.tagneedFactor.create({
          data: {
            id: factor.id,
            name: factor.name,
          },
        })
    );

    await Promise.all(factorPromises);
  } catch (err) {}

  try {
    const sarya = await prisma.sarya.create({
      data: {
        name: "الاولى",
      },
    });

    await prisma.fasela.create({
      data: {
        name: "الاولى",
        saryaId: sarya.id,
      },
    });
  } catch (err) {}

  try {
    const soldiers = (
      await query<Soldier[]>(`
      select
        military_no as militaryNo,
        national_no as nationalNo,
        segl_no as seglNo,
        mrhla as marhla,
        moahel_code as qualificationId,
        religion_code as religionId,
        center_code as centerId,
        tagneed_factor as tagneedFactorId,
        soldier_name as name
      from src_soldiers
    `)
    ).map((soldier) => ({
      ...soldier,
      militaryNo: +soldier.militaryNo,
      nationalNo: +soldier.nationalNo,
      seglNo: +soldier.seglNo,
      marhla: +soldier.marhla,
      qualificationId: +soldier.qualificationId,
      religionId: +soldier.religionId,
      centerId: +soldier.centerId,
      tagneedFactorId: +soldier.tagneedFactorId,
      name: removeArabicDialicts(soldier.name),
      faselaId: 1,
    }));

    const promises = soldiers.map(
      async (sol) =>
        await prisma.soldier.create({
          data: sol,
        })
    );

    await Promise.all(promises);
    console.log("seeded soldiers");
  } catch (err) {
    console.error(err);
  }
};

seed()
  .then(() => {
    console.log("seeded successfully");
  })
  .catch((err) => console.error(err));
