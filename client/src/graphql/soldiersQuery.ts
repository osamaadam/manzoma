import { gql } from "@apollo/client";

export const soldiersQuery = gql`
  query (
    $where: SoldierWhereInput
    $orderBy: [SoldierOrderByWithRelationInput!]
    $cursor: SoldierWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [SoldierScalarFieldEnum!]
  ) {
    soldiers(
      where: $where
      orderBy: $orderBy
      cursor: $cursor
      take: $take
      skip: $skip
      distinct: $distinct
    ) {
      seglNo
      militaryNo
      nationalNo
      marhla
      name
      registerationDate
      qualification {
        name
      }
      religion {
        name
      }
      center {
        name
        gov {
          name
        }
      }
      status {
        id
        name
      }
      predefinedEtgah {
        name
      }
      address
    }
  }
`;
