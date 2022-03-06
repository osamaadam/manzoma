import {
  Arg,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../index";

@ObjectType()
class Stats {
  @Field((type) => Int)
  totalSoldiers: number;

  @Field((type) => Int)
  totalMawkef: number;

  @Field((type) => Int)
  totalRaft: number;
}

@Resolver((of) => Stats)
export class StatsResolver {
  @Query((returns) => Stats)
  async stats(
    @Arg("marhla", (type) => Int) marhla: number,
    @Ctx() { prisma }: Context
  ) {
    const totalSoldiersPromise = prisma.soldier.count({
      where: { marhla },
    });
    const totalMawkefPromise = prisma.soldier.count({
      where: { marhla, statusId: 1 },
    });
    const totalRaftPromise = prisma.soldier.count({
      where: { marhla, statusId: 2 },
    });

    const [totalMawkef, totalRaft, totalSoldiers] = await Promise.all([
      totalMawkefPromise,
      totalRaftPromise,
      totalSoldiersPromise,
    ]);

    return {
      totalMawkef,
      totalRaft,
      totalSoldiers,
    };
  }
}
