import { gql } from "@apollo/client";

export const registerTawzeaMutation = gql`
  mutation RegisterTawzea(
    $unit: Int!
    $receivedTawzea: Int!
    $tawzeas: [RegisterTawzeaInput!]!
  ) {
    registerTawzea(
      unit: $unit
      receivedTawzea: $receivedTawzea
      tawzeas: $tawzeas
    ) {
      id
    }
  }
`;
