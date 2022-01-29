import { User, UserCreateInput, UserWhereInput } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";
import { compare, hash } from "bcrypt";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../index";
import jwt from "jsonwebtoken";

@ObjectType()
class UserWithToken extends User {
  @Field()
  token: string;
}

@InputType()
class UserLoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class CustomUserResolver {
  @Mutation((returns) => User)
  async register(
    @Arg("user") user: UserCreateInput,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    const hashedPassword = await hash(user.password, 10);

    return prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
      },
    });
  }

  @Query((returns) => User, { nullable: true })
  async me(@Ctx() { user }: Context) {
    return user ?? null;
  }

  @Query((returns) => UserWithToken, { nullable: true })
  async login(@Arg("user") user: UserLoginInput, @Ctx() { prisma }: Context) {
    const dbUser = await prisma.user.findFirst({
      where: {
        username: user.username,
      },
    });
    const invalidErr = new UserInputError("اسم المستخدم او كلمة المرور خاطئة");

    if (!dbUser) throw invalidErr;

    const isValidPassword = await compare(user.password, dbUser.password);

    if (!isValidPassword) throw invalidErr;

    const token = jwt.sign(
      {
        id: dbUser.id,
        username: dbUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return {
      ...dbUser,
      token,
    };
  }
}
