const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User.js");
const EditorModel = require("../Models/Editor.js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage }).single('thumbnail');


// Signup function without image upload logic
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists. Please log in.', success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user without profile picture
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errorMsg = "Authentication failed. Invalid email or password.";

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            {
                username: user.username,
                _id: user._id,
            },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Signin successful",
            success: true,
            jwtToken,
            name: user.name, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const createEditor = async (req, res) => {
    try {
      // Use multer to handle the file upload
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error uploading file",
            success: false,
          });
        }
  
        // Extract form data from request body
        const { title, content, tags, author, date } = req.body;
        const thumbnail = req.file ? req.file.path : null; // Store the file path in the database
  
        // Create a new blog post
        const newEditor = new EditorModel({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()),  // Split and trim tags
          thumbnail,  // Store the image file path
          author,
          date,
        });
  
        // Save the blog post to the database
        await newEditor.save();
  
        res.status(201).json({
          message: "Blog created successfully",
          success: true,
          Editor: newEditor,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating blog post",
        success: false,
      });
    }
  };

module.exports = {
    signup,
    signin,
    createEditor
};
