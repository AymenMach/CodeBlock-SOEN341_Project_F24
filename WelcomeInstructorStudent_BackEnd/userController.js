const express = require('express');
const { loginUser } = require('../controllers/userController'); // Make sure the path is correct

const router = express.Router();

// Define the login route
router.post('/login', loginUser);

module.exports = router;
