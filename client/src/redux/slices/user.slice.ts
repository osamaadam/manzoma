import { createHttpLink } from "@apollo/client";
import { createSlice } from "@reduxjs/toolkit";
import { apolloClient, GRAPHQL_URI } from "../..";
import { AsyncState } from "../../types/AsyncState";
import { login } from "../thunks/login";

interface UserType {
  details: AsyncState<{ username: string; id: string; token: string }>;
  isLoggedIn: boolean;
}

const initialState: UserType = {
  details: {
    status: "idle",
    data: null,
  },
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      apolloClient.setLink(
        createHttpLink({
          uri: GRAPHQL_URI,
          headers: {
            authorization: undefined,
          },
        })
      );
      state.isLoggedIn = false;
      state.details = {
        data: null,
        status: "cleared",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.details = {
          ...state.details,
          data: null,
          error: null,
          status: "pending",
        };
      })
      .addCase(login.rejected, (state, action) => {
        const error: { message: string } = action.payload as any;

        state.details = {
          ...state.details,
          data: null,
          error: error.message,
          status: "failed",
        };
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.details = {
          ...state.details,
          status: "succeeded",
          data: action.payload!,
        };
        state.isLoggedIn = true;

        apolloClient.setLink(
          createHttpLink({
            uri: GRAPHQL_URI,
            headers: {
              authorization: `Bearer ${action.payload?.token}`,
            },
          })
        );
      });
  },
});

export const { logout } = userSlice.actions;
export { login };

export default userSlice.reducer;
