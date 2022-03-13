import {
  Soldier,
  SoldierOrderByWithRelationInput,
  SoldierScalarFieldEnum,
  SoldierWhereInput,
  SoldierWhereUniqueInput,
} from "@generated/type-graphql";
import { Arg, Ctx, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Context } from "../..";

@ObjectType()
class MiniSoldiers extends Soldier {}

@Resolver()
export class MiniSoldiersResolver {
  @Query((returns) => [MiniSoldiers]!)
  async miniSoldiers(
    @Arg("where", (type) => SoldierWhereInput) where: SoldierWhereInput,
    @Arg("orderBy", (type) => [SoldierOrderByWithRelationInput!], {
      nullable: true,
    })
    orderBy: SoldierOrderByWithRelationInput,
    @Arg("cursor", (type) => SoldierWhereUniqueInput, { nullable: true })
    cursor: SoldierWhereUniqueInput,
    @Arg("take", (type) => Int, { nullable: true }) take: number,
    @Arg("skip", (type) => Int, { nullable: true }) skip: number,
    @Arg("distinct", (type) => [SoldierScalarFieldEnum!], { nullable: true })
    distinct: SoldierScalarFieldEnum,
    @Ctx() { prisma }: Context
  ) {
    return prisma.soldier.findMany({
      cursor,
      distinct,
      orderBy,
      skip,
      take,
      where,
    });
  }
}
