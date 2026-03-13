const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cookieparser = require("cookie-parser");

app.use(express.json());
app.use(cookieparser());

//const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
      console.log("Server is successfully listen on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database can not be connected!");
  });
