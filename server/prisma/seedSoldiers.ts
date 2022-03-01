import { PrismaClient, Soldier } from "@prisma/client";
import { normalizeArabic } from "../src/helpers/normalizeArabic";
import { query } from "../src/helpers/query";

export const seedSoldiers = async () => {
  const prisma = new PrismaClient();
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
        soldier_name as name,
        current_degree as rankId,
        etgah as predefinedEtgahId,
        tasgeel_date as registerationDate,
        address
      from src_soldiers
    `)
  ).map((soldier) => ({
    ...soldier,
    militaryNo: soldier.militaryNo,
    nationalNo: soldier.nationalNo,
    seglNo: +soldier.seglNo,
    marhla: +soldier.marhla,
    qualificationId: +soldier.qualificationId,
    religionId: +soldier.religionId,
    centerId: +soldier.centerId,
    tagneedFactorId: +soldier.tagneedFactorId,
    name: normalizeArabic(soldier.name),
    rankId: +soldier.rankId,
    predefinedEtgahId: +soldier.predefinedEtgahId,
    statusId: 0,
    registerationDate: soldier.registerationDate,
  }));

  await prisma.$transaction(
    soldiers.map((sol) =>
      prisma.soldier.create({
        data: {
          militaryNo: sol.militaryNo,
          nationalNo: sol.nationalNo,
          seglNo: sol.seglNo,
          marhla: sol.marhla,
          address: sol.address,
          registerationDate: sol.registerationDate,
          predefinedEtgah: {
            connect: {
              id: sol.predefinedEtgahId,
            },
          },
          qualification: {
            connect: {
              id: sol.qualificationId,
            },
          },
          religion: {
            connect: {
              id: sol.religionId,
            },
          },
          center: {
            connect: {
              id: sol.centerId,
            },
          },
          tagneedFactor: {
            connect: {
              id: sol.tagneedFactorId,
            },
          },
          name: sol.name,
          rank: {
            connect: {
              id: sol.rankId,
            },
          },
        },
      })
    )
  );

  console.log("seeded soldier table");
};
