const ejs = require('ejs');
const blog = require('../model/blog.js');
const mongoose = require("mongoose");

const getaddBlog = (req, res) => {
    res.render("addblogs");
}

const postaddBlog = async (req, res) => {
    const {title, body} = req.body;
    console.log(req.user);
    const blogResult = await blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });

    res.redirect('/');
}

const getmyBlogs = async (req, res) => {
    const id = req.user._id;
    const myBlogs = await blog.find({ createdBy: id });
    res.render("myblogs", {
        myBlogs: myBlogs,
    });
}

module.exports = {
    getaddBlog,
    postaddBlog,
    getmyBlogs,
}