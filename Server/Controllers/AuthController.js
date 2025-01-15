const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User.js");
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
const upload = multer({ storage }).single('profilePicture');

// Signup function
const signup = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload failed", success: false });
        }
        try {
            const { username, email, password } = req.body;
            const profilePicture = req.file ? req.file.filename : '';

            const user = await UserModel.findOne({ email });
            if (user) {
                return res.status(409).json({ message: 'User already exists. Please log in.', success: false });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ username, email, password: hashedPassword, profilePicture });
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
    });
};

const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const errorMsg = "Authentication failed. Invalid username or password.";

        const user = await UserModel.findOne({ username });
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
            username: user.username, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

module.exports = {
    signup,
    signin,
};
