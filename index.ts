import express from "express";
import pingRouter from "./routes/ping";
import testRouter from "./routes/test";
import formDataRouter from "./routes/formData";
import insertRouter from "./routes/insert";

require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 4000;

app.use("/ping", pingRouter);
app.use("/test", testRouter);
app.use("/form-data", formDataRouter);
app.use("/insert", insertRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
