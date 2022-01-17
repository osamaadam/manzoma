import { normalize } from "path";

export const genConnectionString = (filepath: string) =>
  `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${normalize(
    filepath
  )};Persist Security Info=False;`;
