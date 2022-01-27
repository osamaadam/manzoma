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
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

export const URI =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000";

export const GRAPHQL_URI = URI + "/graphql";

axios.defaults.baseURL = URI;

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_URI,
  }),
  cache: new InMemoryCache(),
});

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={arEG} direction="rtl">
        <BrowserRouter basename="/manzoma">
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
