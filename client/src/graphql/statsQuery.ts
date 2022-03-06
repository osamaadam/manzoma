import { gql } from "@apollo/client";

export const statsQuery = gql`
  query ($marhla: Int!) {
    stats(marhla: $marhla) {
      totalSoldiers
      totalMawkef
      totalRaft
    }
  }
`;
