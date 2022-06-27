const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userrouter = require("./routes/user-routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", userrouter);
const port = 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port);
    console.log(`DB connected & server Started on port ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
