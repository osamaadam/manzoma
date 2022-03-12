import { gql } from "@apollo/client";

export const soldierQuery = gql`
  query SoldierQuery($where: SoldierWhereUniqueInput!) {
    soldier(where: $where) {
      name
      militaryNo
      seglNo
    }
  }
`;
