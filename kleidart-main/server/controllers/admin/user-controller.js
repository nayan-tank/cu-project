const User = require("../../models/User"); // Assuming a User model exists

// Fetch all users
const getUsersList = async (req, res) => {
  try {
    // const users = await User.find({}, "userName email role");
    const users = await User.find({});
    
    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found!",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findOne({id});
    res.status(200).json({
      success: true,
      data: user,
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from route parameters
    const { userName, email, phone, role } = req.body; // Fields to update

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, email, phone, role }, // Update the necessary fields
      { new: true, runValidators: true } // Returns updated user and runs validation
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from route parameters

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsersList,
  updateUser,
  deleteUser,
  getUserDetails
};
