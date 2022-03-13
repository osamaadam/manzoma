import { gql } from "@apollo/client";

export const statsQuery = gql`
  query SoldierStatsQuery($marhla: Int!) {
    stats(marhla: $marhla) {
      totalSoldiers
      totalMawkef
      totalRaft
    }
  }
`;
