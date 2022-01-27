import { createAsyncThunk } from "@reduxjs/toolkit";
import { apolloClient } from "../..";
import { gql } from "@apollo/client";

export const login = createAsyncThunk(
  "user/login",
  async (
    user: {
      username: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const resp = await apolloClient.query<{
        login: { username: string; id: string; token: string };
      }>({
        query: gql`
          query login($user: UserLoginInput!) {
            login(user: $user) {
              id
              username
              token
            }
          }
        `,
        variables: {
          user,
        },
      });

      return resp.data.login;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
