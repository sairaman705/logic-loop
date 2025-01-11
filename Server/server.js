require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "bonjure",
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/logicLoop" }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, 
  },
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/logicLoop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Schemas and Models
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String,
});

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  category: String,
  image: String,
  publishedDate: String,
  tags: [String],
  comments: [{ user: String, comment: String, date: String }],
});

const User = mongoose.model("Users", userSchema);
const BlogPosts = mongoose.model("BlogPosts", blogSchema);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, or .png files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
// Sign Up Route
app.post("/signup", upload.single("image"), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  if (!username || !email || !password || !profilePicture) {
    return res.status(400).send("All fields are required");
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, email, password: hashedPassword, profilePicture });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

// Sign In Route
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid username or password");
    }

    // Save user info in session
    req.session.user = { id: user._id, username: user.username };
    console.log("Session after login:", req.session);
    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send("Error during login: " + err.message);
  }
});

// Check Session Route
app.get("/check-session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session && req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
      res.clearCookie("connect.sid");
      res.status(200).send("Logged out successfully");
    });
  } else {
    res.status(400).send("No active session to log out");
  }
});

// Fetch all blog posts
app.get("/", async (req, res) => {
  try {
    const blogs = await BlogPosts.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).send("Error fetching blogs: " + err.message);
  }
});

// Add Blog Route
app.post("/add-blog", upload.single("thumbnail"), async (req, res) => {
  try {
    // Extract fields from the request body
    const { title, description, tags } = req.body;
    const thumbnail = req.file ? req.file.filename : null; // Handle image upload
    const publishedDate = new Date().toISOString(); // Set the current date as published date

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Create a new blog post object
    const newBlog = new BlogPosts({
      title,
      author,
      content,
      category,
      image,
      publishedDate,
      tags: tags ? tags.split(",") : [],
    });

    // Save the blog post to the database
    const savedBlog = await newBlog.save();

    // Respond with success
    res.status(201).json({
      message: "Blog post created successfully",
      blog: savedBlog,
    });
  } catch (err) {
    console.error("Error adding blog post:", err.message); // Log the error for debugging
    res.status(500).json({ message: "Error adding blog post: " + err.message });
  }
});

// Error Handling Middleware
app.use((req, res, next) => {
  console.log("session info : ", req.session);
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

