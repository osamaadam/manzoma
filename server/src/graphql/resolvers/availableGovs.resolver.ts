import { Gov } from "@generated/type-graphql";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { Context } from "../..";

@Resolver()
export class AvailableGovs {
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
}
