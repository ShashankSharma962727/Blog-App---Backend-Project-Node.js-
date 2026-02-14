const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");
const authRouter = require("./router/authRouter");
const mongoose = require("mongoose");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
require('dotenv').config();


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(verifyJWT);
app.use((req, res, next) => {
  res.locals.user = req.user; 
  return next();
});
app.set("view engine", "ejs");
app.use("/", authRouter);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

