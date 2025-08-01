const User = require('../models/User')

// Get User Profile Function
const GetUserProfile = async (req, res) => {
    try {
        const { payload } = res.locals // Get the user ID from the token payload
        
        // Find the user, excluding the password
        const user = await User.findById(payload.id).select('-passwordDigest')
        if (!user) {
            return res.status(404).send({ status: 'Error', msg: 'User not found' })
        }
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'An error occurred while fetching user profile' })
    }
}

// Update User Picture Function
const UpdateUserPicture = async (req, res) => {
  try {
    const { payload } = res.locals; // user ID from token
    const { picture } = req.body; // picture URL from request

    // Update user's picture
    const user = await User.findByIdAndUpdate(
      payload.id,
      { picture },
      { new: true }
    ).select("username email picture"); // exclude password

    if (!user) {
      return res.status(404).send({ status: "Error", msg: "User not found" });
    }

    return res.status(200).send({
      status: "Success",
      msg: "Profile picture updated successfully",
      user
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "Error", msg: "An error occurred while updating picture" });
  }
};


module.exports = {
    GetUserProfile,
    UpdateUserPicture
}