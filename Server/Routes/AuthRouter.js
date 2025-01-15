const { signup, signin } = require("../Controllers/AuthController");
const { signupValidation, signinValidation } = require("../Middlewares/AuthMiddleware");
const multer = require('multer');
const router = require("express").Router();

router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);

module.exports = router;