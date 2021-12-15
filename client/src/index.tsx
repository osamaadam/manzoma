import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import arEG from "antd/lib/locale/ar_EG";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.less";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://dell:4000"
    : "http://localhost:4000";

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={arEG} direction="rtl">
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
