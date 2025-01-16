const { signup, signin, createEditor } = require("../Controllers/AuthController.js");
const { signupValidation, signinValidation } = require("../Middlewares/AuthMiddleware");
const multer = require('multer');
const router = require("express").Router();

router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.post('/write', createEditor);

module.exports = router;