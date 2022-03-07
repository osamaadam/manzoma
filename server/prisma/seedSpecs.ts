import { PrismaClient } from "@prisma/client";
import { normalizeArabic } from "../src/helpers/normalizeArabic";
import { query } from "../src/helpers/query";

export const seedSpecs = async (prisma: PrismaClient) => {
  const accessSpecs = (
    await query<
      {
        id: string | number;
        name: string;
        weaponId: string | number;
      }[]
    >(`
    select job_des_no as id, job_des_name as name, fk_wep_no as weaponId
    from job_description1
  `)
  ).map((spec) => ({
    id: +spec.id,
    name: normalizeArabic(spec.name),
    weaponId: +spec.weaponId,
  }));

  await prisma.$transaction(
    accessSpecs.map((spec) =>
      prisma.specialization.create({
        data: {
          id: spec.id,
          name: spec.name,
          weaponId: spec.weaponId,
        },
      })
    )
  );

  console.log("seeded specializations");
};
