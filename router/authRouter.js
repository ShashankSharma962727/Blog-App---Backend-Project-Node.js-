const express = require("express");
const authRouter = express.Router();
const authControllers = require("../controllers/authControllers.js");
const protectRoute = require("../middlewares/protectRoute.js");

authRouter.get("/signup", authControllers.getSignUp);
authRouter.get("/signin", authControllers.getSignIn);
authRouter.post("/signup", authControllers.postSignUp);
authRouter.post("/signin", authControllers.postSignIn);
authRouter.get("/logout", authControllers.logout);

module.exports = authRouter;
