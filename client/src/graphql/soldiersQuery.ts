import { gql } from "@apollo/client";

export const soldiersQuery = gql`
  query SoldiersQuery(
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
      tawzea {
        unit {
          name
          etgah {
            name
          }
        }
        specialization {
          id
          name
        }
      }
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
    groupBySoldier(by: [marhla, statusId], where: $where) {
      statusId
      _count {
        militaryNo
      }
    }
  }
`;
