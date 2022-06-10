import { AuthChecker } from "type-graphql";
import { Context } from "..";

export const authChecker: AuthChecker<Context> = ({ context }) =>
  context.isAuthenticated;
