import { gql } from "@apollo/client";

export const receivedTawzeasQuery = gql`
  query ReceivedTawzeas(
    $where: ReceivedTawzeaWhereInput
    $orderBy: [ReceivedTawzeaOrderByWithRelationInput!]
    $cursor: ReceivedTawzeaWhereUniqueInput
    $take: Int
    $skip: Int
    $distinct: [ReceivedTawzeaScalarFieldEnum!]
  ) {
    receivedTawzeas(
      where: $where
      orderBy: $orderBy
      cursor: $cursor
      take: $take
      skip: $skip
      distinct: $distinct
    ) {
      id
      displayName
      numOfPages
      dateReceived
      marhla
    }
  }
`;
