const jwt = require("jsonwebtoken");
const Blog = require("../model/Blog");
const User = require("../model/User");

/**
 * Middleware to authenticate users via JWT.
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; 
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

/**
 * Middleware to verify blog ownership for edit/delete actions.
 */
const verifyBlogOwnership = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.userId;

  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving blog." });
  }

  if (!blog) {
    return res.status(404).json({ message: "Blog not found!" });
  }

  if (blog.user.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized to modify this blog." });
  }

  req.blog = blog; // Attach blog to request for further use
  next();
};

module.exports = { verifyToken, verifyBlogOwnership };
