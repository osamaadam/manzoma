import express from "express";
import pingRouter from "./routes/ping";
import testRouter from "./routes/test";
import formDataRouter from "./routes/formData";
import insertRouter from "./routes/insert";
import cors from "cors";
import { resolve } from "path";

require("dotenv").config({ path: resolve(__dirname, "..", ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 4000;

app.use("/ping", pingRouter);
app.use("/test", testRouter);
app.use("/form-data", formDataRouter);
app.use("/insert", insertRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
