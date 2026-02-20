const ejs = require("ejs");
const blog = require("../model/blog.js");
const mongoose = require("mongoose");

const home = async (req, res) => {
  try {
    const allBlogs = await blog.find({});
    res.render("home", {
      allBlogs: allBlogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while loading the homepage.");
  }
};

const getaddBlog = (req, res) => {
  try {
    res.render("addblogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while loading add blog page.");
  }
};

const postaddBlog = async (req, res) => {
  try {
    const { title, body } = req.body;
    console.log(req.user);
    const blogResult = await blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });

    res.redirect("/blogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while creating blog.");
  }
};

const getmyBlogs = async (req, res) => {
  try {
    const id = req.user._id;
    const myBlogs = await blog.find({ createdBy: id });
    res.render("myblogs", {
      myBlogs: myBlogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while loading your blogs.");
  }
};

const readBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blogData = await blog.findById(id);

    if (!blogData) {
      return res.status(404).send("Blog not found.");
    }

    res.render("readBlog", { blog: blogData, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while reading the blog.");
  }
};

const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    await blog.deleteOne({ _id: id });
    res.redirect("/blogs/myblogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while deleting the blog.");
  }
};


const editBlogFrom = async (req, res) => {
  try {
    const id = req.params.id;
    const blogData = await blog.findById(id);

    if (!blogData) {
      return res.status(404).send("Blog Not Found!");
    }

    res.render("editBlog", { blogData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while loading edit blog form.");
  }
};


const posteditBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, body } = req.body;

    const updateData = { title, body };

    if (req.file) {
      updateData.coverImageURL = `/uploads/${req.file.filename}`;
    }

    await blog.findByIdAndUpdate(id, updateData);
    res.redirect("/blogs/myblogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while updating the blog.");
  }
};

module.exports = {
  getaddBlog,
  postaddBlog,
  getmyBlogs,
  home,
  readBlog,
  deleteBlog,
  posteditBlog,
  editBlogFrom,
};