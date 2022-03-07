import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import arEG from "antd/lib/locale/ar_EG";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.less";
import store from "./redux/store";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { Soldier } from "type-graphql";

export const URI =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000";

export const GRAPHQL_URI = URI + "/graphql";

axios.defaults.baseURL = URI;

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_URI,
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          soldiers: {
            keyArgs: false,
            merge: (prev: Soldier[] = [], incoming: Soldier[]) => [
              ...prev,
              ...incoming,
            ],
          },
        },
      },
    },
  }),
});

store.subscribe(() => {
  const curState = store.getState();
  localStorage.setItem("reduxState", JSON.stringify(curState));
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={arEG} direction="rtl" componentSize="middle">
        <BrowserRouter basename="/manzoma">
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
