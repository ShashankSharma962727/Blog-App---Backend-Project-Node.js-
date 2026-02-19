const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");
const authRouter = require("./router/authRouter");
const blogRouter = require('./router/blogRouter');
const mongoose = require("mongoose");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const path = require('path');


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(verifyJWT);
app.use((req, res, next) => {
  res.locals.user = req.user; 
  return next();
});
app.set("view engine", "ejs");
app.use("/", authRouter);
app.use("/blogs", blogRouter);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
