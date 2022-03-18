import { AuthChecker } from "type-graphql";
import { Context } from "..";

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return context.isAuthenticated;
};
