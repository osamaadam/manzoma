import adodb from "node-adodb";
import { genConnectionString } from "./genConnectionString";

require("dotenv").config();

export const executeQuery = async <T>(query: string) => {
  const { MDB_PATH } = process.env;
  if (!MDB_PATH?.trim()) {
    throw new Error("MDB_PATH is not set");
  }

  const connectionString = genConnectionString(MDB_PATH);

  const access = adodb.open(connectionString, false);

  return access.execute<T>(query);
};
