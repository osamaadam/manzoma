import { PrismaClient, Qualification, Religion, Soldier } from "@prisma/client";
import { normalizeArabic } from "../src/helpers/normalizeArabic";
import { query } from "../src/helpers/query";
import seedData from "./seed.data";

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
    name: normalizeArabic(religion.name),
  }));

  try {
    await prisma.$transaction(
      religions.map((religion) =>
        prisma.religion.create({
          data: religion,
        })
      )
    );
    console.log("seeded religion table");
  } catch (err) {}

  try {
    const ranks = (
      await query<{ id: number; name: string }[]>(`
      select
        deg_no as id,
        deg_name as name
      from degree
    `)
    ).map((rank) => ({
      id: +rank.id,
      name: normalizeArabic(rank.name),
    }));
    await prisma.$transaction(
      ranks.map((rank) =>
        prisma.rank.create({
          data: {
            id: rank.id,
            name: rank.name,
          },
        })
      )
    );
    console.log("seeded rank");
  } catch (err) {}

  try {
    prisma.$transaction(
      seedData.Status.map((status) =>
        prisma.status.create({
          data: {
            id: status.id,
            name: status.name,
            statusTypeId: status.statusTypeId,
          },
        })
      )
    );

    console.log("seeded status");
  } catch (err) {}

  const qualifications = (
    await query<Qualification[]>(`
      select
        moahel_code as id,
        moahel_name as name
      from moahel_type
    `)
  ).map((qual) => ({
    ...qual,
    id: +qual.id,
    name: normalizeArabic(qual.name),
  }));

  try {
    await prisma.$transaction(
      qualifications.map((qual) =>
        prisma.qualification.create({
          data: qual,
        })
      )
    );
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
      and mantek_tagneed is not null
  `)
  ).map((gov) => ({
    ...gov,
    id: +gov.id,
    name: normalizeArabic(gov.name),
    tagneed: gov.tagneed && normalizeArabic(gov.tagneed),
  }));

  const tagneeds = [
    ...new Set(govs.map((gov) => gov.tagneed).filter((tag) => tag)),
  ];

  try {
    await prisma.tagneed.create({
      data: {
        id: 0,
        name: "غير مبين",
      },
    });

    const tags = await prisma.$transaction(
      tagneeds.map((tag) =>
        prisma.tagneed.create({
          data: {
            name: tag,
          },
        })
      )
    );

    console.log("seeded tagneed table");

    await prisma.gov.create({
      data: {
        id: 0,
        name: "غير مبين",
        tagneed: {
          connect: {
            id: 0,
          },
        },
      },
    });

    await prisma.$transaction(
      govs.map((gov) =>
        prisma.gov.create({
          data: {
            id: gov.id,
            name: gov.name,
            tagneed: {
              connect: {
                id: tags.find(
                  (tag) =>
                    normalizeArabic(tag.name) === normalizeArabic(gov.tagneed)
                ).id,
              },
            },
          },
        })
      )
    );

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
      name: normalizeArabic(center.name),
    }));

    await prisma.$transaction(
      centers.map((center) =>
        prisma.center.create({
          data: {
            id: center.id,
            name: center.name,
            gov: {
              connect: {
                id: center.govid,
              },
            },
          },
        })
      )
    );

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
      name: normalizeArabic(factor.name),
    }));

    await prisma.$transaction(
      tagneedFactors.map((factor) =>
        prisma.tagneedFactor.create({
          data: {
            id: factor.id,
            name: factor.name,
          },
        })
      )
    );

    console.log("seeded tagneedFactor table");
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
        soldier_name as name,
        current_degree as rankId,
        address
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
      name: normalizeArabic(soldier.name),
      rankId: +soldier.rankId,
      statusId: 0,
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
  } catch (err) {
    console.error(err);
  }

  try {
    const militaryEntities = (
      await query<
        {
          id: number;
          name: string;
          centerId: number;
        }[]
      >(`
      select
        geha_code as id,
        geha_name as name,
        markaz_code as centerId
      from geha_code
        where geha_code is not null
    `)
    ).map((entity) => ({
      ...entity,
      id: +entity.id,
      centerId:
        !isNaN(+entity.centerId) && +entity.centerId <= 522
          ? +entity.centerId
          : 0,
      name: normalizeArabic(entity.name),
    }));

    await prisma.$transaction(
      militaryEntities.map((entity) =>
        prisma.militaryEntity.create({
          data: {
            id: +entity.id,
            name: entity.name,
            center: {
              connect: { id: entity.centerId },
            },
          },
        })
      )
    );

    console.log("seeded entity table");
  } catch (err) {}

  try {
    const weapons = (
      await query<{ id: number; name: string }[]>(`
      select
        selah_code as id,
        selah as name
      from selah
    `)
    ).map((weapon) => ({
      id: weapon.id,
      name: normalizeArabic(weapon.name),
    }));

    await prisma.weapon.create({
      data: {
        id: 0,
        name: "غير مبين",
      },
    });

    await prisma.$transaction(
      weapons.map((weapon) =>
        prisma.weapon.create({
          data: {
            id: weapon.id,
            name: weapon.name,
          },
        })
      )
    );
    console.log("seeded weapon table");
  } catch (err) {}

  try {
    const etgahat = (
      await query<{ id: number; name: string }[]>(`
      select
        cod_tmrkz as id,
        nam_tmrkz as name
      from tmrkz_c
    `)
    ).map((etgah) => ({
      id: +etgah.id,
      name: normalizeArabic(etgah.name),
    }));

    await prisma.$transaction(
      etgahat.map((etgah) =>
        prisma.etgah.create({
          data: {
            id: etgah.id,
            name: etgah.name,
          },
        })
      )
    );

    console.log("seeded etgah table");
  } catch (err) {}

  try {
    const units = (
      await query<
        {
          id: number;
          name: string;
          parentId: number;
          entityId: number;
          weaponId: number;
          etgahId: number;
        }[]
      >(`
      select
        unit_c as id,
        unit_name as name,
        pernt_c as parentId,
        geha_code as entityId,
        selah_c as weaponId,
        tmrz_cod as etgahId
      from units
      order by unit_c asc
    `)
    ).map((unit) => ({
      ...unit,
      id: +unit.id,
      name: normalizeArabic(unit.name),
      parentId: !isNaN(+unit.parentId) ? +unit.parentId : 0,
      entityId: !isNaN(+unit.entityId) ? +unit.entityId : 0,
      weaponId: !isNaN(+unit.weaponId) ? +unit.weaponId : 0,
      etgahId: !isNaN(+unit.etgahId) ? +unit.etgahId : 0,
    }));

    await prisma.$transaction(
      units.map((unit) =>
        prisma.unit.upsert({
          where: {
            id: unit.id,
          },
          create: {
            id: unit.id,
            name: unit.name,
            weapon: {
              connect: {
                id: unit.weaponId,
              },
            },
            etgah: {
              connect: {
                id: unit.etgahId,
              },
            },
            militaryEntity: {
              connectOrCreate: {
                create: {
                  id: unit.entityId,
                  name: "غير مبين",
                  center: {
                    connect: {
                      id: 0,
                    },
                  },
                },
                where: {
                  id: unit.entityId,
                },
              },
            },
            parent: {
              connectOrCreate: {
                create: {
                  id: unit.parentId,
                  name: "غير مبين",
                  weapon: {
                    connect: {
                      id: unit.weaponId,
                    },
                  },
                  etgah: {
                    connect: {
                      id: unit.etgahId,
                    },
                  },
                  militaryEntity: {
                    connectOrCreate: {
                      create: {
                        id: unit.entityId,
                        name: "غير مبين",
                        center: {
                          connect: {
                            id: 0,
                          },
                        },
                      },
                      where: {
                        id: unit.entityId,
                      },
                    },
                  },
                },
                where: {
                  id: unit.parentId,
                },
              },
            },
          },
          update: {
            name: unit.name,
            weapon: {
              connect: {
                id: unit.weaponId,
              },
            },
            etgah: {
              connect: {
                id: unit.etgahId,
              },
            },
            parent: {
              connectOrCreate: {
                create: {
                  id: unit.parentId,
                  name: "غير مبين",
                  weapon: {
                    connect: {
                      id: unit.weaponId,
                    },
                  },
                  etgah: {
                    connect: {
                      id: unit.etgahId,
                    },
                  },
                  militaryEntity: {
                    connect: {
                      id: unit.entityId,
                    },
                  },
                },
                where: {
                  id: unit.parentId,
                },
              },
            },
          },
        })
      )
    );

    console.log("seeded unit table");
  } catch (err) {}
};

seed()
  .then(() => console.log("seeded successfully"))
  .catch((err) => console.error(err));
