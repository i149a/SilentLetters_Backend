const router = require('express').Router()
const controller = require('../controllers/letterController')
const middleware = require('../middleware')

// Public routes - no authentication required
router.get('/public-letters', controller.GetPublicLetters)
router.get('/public-letter/:id', controller.GetLetterById)

// Protected routes - require authentication
router.post('/create-letter', 
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateLetter
)

router.get('/my-letters',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetMyLetters
)

router.put('/update-letter/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateLetter
)

router.delete('/delete-letter/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteLetter
)

router.get('/by-tag/:tagId', 
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetLettersByTag
);

module.exports = router