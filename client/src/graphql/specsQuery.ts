import { gql } from "@apollo/client";

export const specsQuery = gql`
  query SpecializationsQuery(
    $where: SpecializationWhereInput
    $orderBy: [SpecializationOrderByWithRelationInput!]
    $cursor: SpecializationWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [SpecializationScalarFieldEnum!]
  ) {
    specializations(
      where: $where
      orderBy: $orderBy
      cursor: $cursor
      take: $take
      skip: $skip
      distinct: $distinct
    ) {
      id
      name
      weapon {
        id
        name
      }
    }
  }
`;
