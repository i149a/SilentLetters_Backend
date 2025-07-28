const router = require('express').Router()
const controller = require('../controllers/userController')
const middleware = require('../middleware')

// Get current user's profile
router.get('/user-profile',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserProfile
)

// Update user's profile picture
router.put('/update-picture',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateUserPicture
)

module.exports = router