import { Tawzea } from "@generated/type-graphql";
import { Context } from "../..";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
} from "type-graphql";

@InputType()
class RegisterTawzeaInput {
  @Field()
  militaryNo: string;

  @Field((type) => Int)
  pageNo: number;

  @Field((type) => Int, { nullable: true })
  spec: number;
}

@Resolver()
export class TawzeaResolver {
  @Mutation((returns) => [Tawzea!])
  async registerTawzea(
    @Arg("receivedTawzea", (type) => Int) receivedTawzea: number,
    @Arg("unit", (type) => Int) unit: number,
    @Arg("tawzeas", (type) => [RegisterTawzeaInput!]!)
    tawzeas: RegisterTawzeaInput[],
    @Ctx() { prisma }: Context
  ) {
    return prisma.$transaction(
      tawzeas.map((taw) =>
        prisma.tawzea.create({
          data: {
            militaryNo: taw.militaryNo,
            pageNo: taw.pageNo,
            specializationId: taw.spec,
            receivedTawzeaId: receivedTawzea,
            unitId: unit,
          },
        })
      )
    );
  }
}
