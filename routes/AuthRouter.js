const router = require('express').Router()
const controller = require('../controllers/authController')
const middleware = require('../middleware')

// Public routes - no authentication required
router.post('/register', controller.Register)
router.post('/login', controller.Login)
router.post('/forget-password', controller.ForgetPassword)

// Protected routes - require authentication
router.post('/signout', 
  middleware.stripToken,
  middleware.verifyToken,
  controller.Signout
)

router.put('/update-password',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdatePassword
)

router.get('/check-session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CheckSession
)

module.exports = router