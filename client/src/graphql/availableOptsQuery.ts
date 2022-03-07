import { gql } from "@apollo/client";

export const availableOptsQuery = gql`
  query availableOpts($marhla: Int!) {
    availableUnits(marhla: $marhla) {
      id
      name
    }
    availableGovs(marhla: $marhla) {
      id
      name
    }
    availableCenters(marhla: $marhla) {
      id
      name
    }
    availableQualifications(marhla: $marhla) {
      id
      name
    }
    etgahs(where: { id: { not: { equals: 0 } } }) {
      id
      name
    }
  }
`;
