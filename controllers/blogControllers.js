const ejs = require('ejs');
const blog = require('../model/blog.js');
const mongoose = require("mongoose");

const getaddBlog = (req, res) => {
    res.render("addblogs");
}

const postaddBlog = async (req, res) => {
    const {title, body} = req.body;
    const blogResult = await blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    console.log(blogResult);

    res.redirect('/');
}

module.exports = {
    getaddBlog,
    postaddBlog,
}