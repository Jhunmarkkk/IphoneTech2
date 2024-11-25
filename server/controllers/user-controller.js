const User = require("../models/User"); // Ensure this is the correct path to your User model

const updateUser = async (req, res) => {
  try {
    const { userId, userData } = req.body; // Adjust according to your request structure

    if (!userId || !userData) {
      return res.status(400).json({
        success: false,
        message: "User ID and data are required!",
      });
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};

module.exports = { updateUser };