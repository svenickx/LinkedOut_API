const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const apiRouter = require("./routes");
var cors = require("cors");

app.use(cors());
app.use("/api/v1", apiRouter);

const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://svenickx:Test1234@cluster0.cnmxrpz.mongodb.net/API_B3?retryWrites=true&w=majority`
  )
  .then(console.log("connected to db"))
  .catch((err) => console.log(err));

app.listen(3001, () => {
  console.log(`http://localhost:3001/`);
});
