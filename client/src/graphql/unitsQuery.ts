import { gql } from "@apollo/client";

export const unitsQuery = gql`
  query UnitsQuery(
    $where: UnitWhereInput
    $orderBy: [UnitOrderByWithRelationInput!]
    $cursor: UnitWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [UnitScalarFieldEnum!]
  ) {
    units(
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
      etgah {
        id
        name
      }
    }
  }
`;
