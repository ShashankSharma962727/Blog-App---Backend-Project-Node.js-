const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const blog = require("../model/blog.js");

const getSignUp = (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while loading the signup page.");
  }
};

const getSignIn = (req, res) => {
  try {
    res.render("signin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while loading the signin page.");
  }
};

const redirect = (req, res) => {
  try {
    res.redirect("/blogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while redirecting.");
  }
};

const postSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { error: "Email already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.create({
      username,
      email,
      password: hash,
    });

    res.redirect("/signin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while signing up.");
  }
};

const postSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("signin", { error: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.render("signin", { error: "Invalid email or password!" });

    const compare = await bcrypt.compare(password, user.password);
    if (!compare)
      return res.render("signin", { error: "Invalid email or password!" });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);
    res.redirect("/blogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while signing in.");
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/signin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while logging out.");
  }
};

module.exports = {
  getSignUp,
  getSignIn,
  postSignUp,
  postSignIn,
  logout,
  redirect,
};