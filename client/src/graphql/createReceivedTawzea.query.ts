import { gql } from "@apollo/client";

export const createReceivedTawzeaMutation = gql`
  mutation CreateReceivedTawzea($data: ReceivedTawzeaCreateInput!) {
    createReceivedTawzea(data: $data) {
      id
      marhla
      displayName
      numOfPages
      dateReceived
    }
  }
`;
