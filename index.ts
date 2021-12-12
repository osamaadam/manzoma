import express from "express";
import pingRouter from "./routes/ping";
import testRouter from "./routes/test";
import formDataRouter from "./routes/formData";

require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 4000;

app.use("/ping", pingRouter);
app.use("/test", testRouter);
app.use("/form-data", formDataRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
