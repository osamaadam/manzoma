import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class FormatedText {
  @Field()
  helloWorld: string;

  @Field({ nullable: true })
  helloName(@Arg("name") name?: string): string {
    if (!name?.length) return null;
    return `Hello, ${name}!`;
  }
}

@Resolver()
export class Hello {
  @Query((returns) => FormatedText)
  async hello() {
    return {
      helloWorld: "Hello World",
    };
  }
}
