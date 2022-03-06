import { gql } from "@apollo/client";

export const availableGovsQuery = gql`
  query ($marhla: Int!) {
    availableGovs(marhla: $marhla) {
      id
      name
    }
  }
`;
