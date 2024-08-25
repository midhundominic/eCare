const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers'); // Adjust the path if necessary

// Define the POST route for sign-up
router.post('/Patient_Login', authControllers.signup); // Ensure signUp is correctly defined in authControllers

module.exports = router;