// const express = require("express")
// const blogRouter = express.Router();
// const { getAllBlogs , addBlog ,
//      updateBlog ,getById , 
//     deleteBlog , getByUserId} = require("../controller/blog-controller");

// blogRouter.get("/",getAllBlogs);
// blogRouter.post('/add', addBlog);
// blogRouter.put("/update/:id",  updateBlog);
// blogRouter.get("/:id", getById);
// blogRouter.delete("/:id",deleteBlog);
// blogRouter.get("/user/:id",getByUserId)
// blogRouter.get("/myBlogs", getMyBlogs);
// module.exports = blogRouter;

const express = require("express");
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
  getMyBlogs,
} = require("../controller/blog-controller");
const { verifyToken, verifyBlogOwnership } = require("../Middleware/blog-middleware");

const blogRouter = express.Router();

// Public Routes
blogRouter.get("/", getAllBlogs); // Retrieve all blogs
blogRouter.get("/:id", getById); // Retrieve blog by ID

// Protected Routes (Require Authentication)
blogRouter.post("/add", addBlog); // Add a new blog
blogRouter.get("/user/:id", verifyToken, getByUserId); // Get blogs by user ID
blogRouter.get("/myblogs", verifyToken, verifyBlogOwnership, getMyBlogs); // Get blogs of logged-in user

// Routes for editing and deleting (Require Authorization)
blogRouter.put("/update/:id", verifyToken, verifyBlogOwnership, updateBlog);
blogRouter.delete("/:id", verifyToken, verifyBlogOwnership, deleteBlog);

module.exports = blogRouter;
