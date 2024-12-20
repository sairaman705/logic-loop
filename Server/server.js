const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// connection
mongoose
  .connect("mongodb://localhost:27017/logicLoop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("failed to connect mongodb", err));

// schema - structure
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String
});

// modal
const User = mongoose.model("Users", userSchema);


// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // Ensure directory exists
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
    cb(new Error("Only .jpg , .jpeg or .png files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Sign Up Route
app.post("/signup", upload.single("image"), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null;
  if (!username || !email || !password || !profilePicture) {
    return res.status(400).send("All fields are required");
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send("Error during login: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
