const express = require("express");
const blogRouter = express.Router();
const protectRoute = require('../middlewares/protectRoute.js');
const multer = require('multer');
const path = require('path');

const blogControllers = require('../controllers/blogControllers.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

blogRouter.get('/addblog',protectRoute, blogControllers.getaddBlog);
blogRouter.post('/addblog',protectRoute, upload.single('coverImageURL'), blogControllers.postaddBlog);

module.exports = blogRouter;