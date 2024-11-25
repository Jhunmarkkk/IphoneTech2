const express = require("express");
const { updateUser } = require("../controllers/user-controller");

const router = express.Router();

// Define the PUT route for updating user information
router.put("/update", updateUser); // Ensure this matches your request

module.exports = router;