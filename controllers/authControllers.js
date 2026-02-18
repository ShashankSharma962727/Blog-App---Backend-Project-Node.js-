const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const blog = require('../model/blog.js');


const home = async (req, res) => {
  const allBlogs = await blog.find({});
  res.render("home",{
    allBlogs: allBlogs,
  });
};

const getSignUp = (req, res) => {
  res.render("signup");
};

const getSignIn = (req, res) => {
  res.render("signin");
};

const postSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hash,
    });

    res.redirect("/signin");
  } catch (error) {
    console.log(error);
  }
};

const postSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.render("signin", { error: "Invalid email or password!",}); 

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) return res.render("signin", { error: "Invalid email or password!", });

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/signin");
};

module.exports = {
  getSignUp,
  getSignIn,
  home,
  postSignUp,
  postSignIn,
  logout,
};
