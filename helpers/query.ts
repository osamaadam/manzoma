import adodb from "node-adodb";

require("dotenv").config();

export const query = async <T>(query: string) => {
  const { CONNECTION_STRING } = process.env;
  if (!CONNECTION_STRING?.trim()) {
    throw new Error("connection string not set");
  }

  const access = adodb.open(CONNECTION_STRING, false);

  return access.query<T>(query);
};
