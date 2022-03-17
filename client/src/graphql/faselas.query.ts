import { gql } from "@apollo/client";

export const faselasQuery = gql`
  query Faselas(
    $where: FaselaWhereInput
    $orderBy: [FaselaOrderByWithRelationInput!]
    $cursor: FaselaWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [FaselaScalarFieldEnum!]
  ) {
    faselas(
      where: $where
      orderBy: $orderBy
      cursor: $cursor
      take: $take
      skip: $skip
      distinct: $distinct
    ) {
      id
      name
    }
  }
`;
