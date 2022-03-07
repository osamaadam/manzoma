import { Gov, Center, Qualification, Unit } from "@generated/type-graphql";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { Context } from "../..";

@Resolver()
export class AvailableOpts {
  @Query((returns) => [Gov]!)
  async availableGovs(
    @Arg("marhla", (type) => Int) marhla: number,
    @Ctx() { prisma }: Context
  ) {
    const govs = await prisma.$queryRaw<Gov[]>`
      select g.*
      from Soldier s
      join Center C on C.id = s.centerId
      join Gov G on G.id = C.govId
      where marhla = ${marhla}
      group by g.id
      order by g.name
    `;

    return govs;
  }

  @Query((returns) => [Center]!)
  async availableCenters(
    @Arg("marhla", (type) => Int) marhla: number,
    @Ctx() { prisma }: Context
  ) {
    const centers = await prisma.$queryRaw<Center[]>`
      select c.*
      from soldier s
      join center c on c.id = s.centerId
      where marhla = ${marhla}
      group by c.id
      order by c.name
    `;

    return centers;
  }

  @Query((returns) => [Qualification]!)
  async availableQualifications(
    @Arg("marhla", (type) => Int) marhla: number,
    @Ctx() { prisma }: Context
  ) {
    const qualifications = await prisma.$queryRaw<Qualification[]>`
      select q.*
      from soldier s
      join qualification q on q.id = s.qualificationId
      where marhla = ${marhla}
      group by q.id
      order by q.name
    `;

    return qualifications;
  }

  @Query((returns) => [Unit]!)
  async availableUnits(
    @Arg("marhla", (type) => Int) marhla: number,
    @Ctx() { prisma }: Context
  ) {
    const units = await prisma.$queryRaw<Unit[]>`
      select u.*
      from Soldier s
      join TawzeaHistory t on s.militaryNo = t.militaryNo
      join unit u on t.unitId = u.id
      group by u.id
      order by u.name;
    `;

    return units;
  }
}
