import { gql } from "@apollo/client";

export const saryasQuery = gql`
  query Saryas(
    $where: SaryaWhereInput
    $orderBy: [SaryaOrderByWithRelationInput!]
    $cursor: SaryaWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [SaryaScalarFieldEnum!]
  ) {
    saryas(
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
