const ejs = require("ejs");
const blog = require("../model/blog.js");
const mongoose = require("mongoose");

const home = async (req, res) => {
  const allBlogs = await blog.find({});
  res.render("home", {
    allBlogs: allBlogs,
  });
};

const getaddBlog = (req, res) => {
  res.render("addblogs");
};

const postaddBlog = async (req, res) => {
  const { title, body } = req.body;
  console.log(req.user);
  const blogResult = await blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  res.redirect("/blogs");
};

const getmyBlogs = async (req, res) => {
  const id = req.user._id;
  const myBlogs = await blog.find({ createdBy: id });
  res.render("myblogs", {
    myBlogs: myBlogs,
  });
};

const readBlog = async (req, res) => {
  const id = req.params.id;
  const blogData = await blog.findById(id);

  return res.render("readBlog", { blog: blogData, user: req.user });
};

const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await blog.deleteOne({_id: id});
    res.redirect('/blogs/myblogs');
  } catch (err) {
    console.log(err);
  }
};

// Get edit blog form
const editBlogFrom = async (req, res) => {
  try{
    const id = req.params.id;
    const blogData = await blog.findById(id);

    if(!blogData){
      res.send("Blog Not Found!");
    }

    res.render("editBlog",{blogData});
  }
  catch(error){
    console.log(error);
  }
};

// Update blog (with or without new image)
const posteditBlog = async (req, res) => {
  try{
    
    const id = req.params.id;
    const {title, body} = req.body;

    const updateData = {
      title,
      body
    }

    if (req.file) {
      updateData.coverImageURL = `/uploads/${req.file.filename}`;
    }

    await blog.findByIdAndUpdate(id, updateData);

    res.redirect("/blogs/myblogs");
  }
  catch(error){
    console.log(error);
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
