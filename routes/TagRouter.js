const router = require('express').Router()
const controller = require('../controllers/tagController')
const middleware = require('../middleware')

// Public routes - no authentication required
router.get('/all-tags', controller.GetAllTags)

// Protected routes - require authentication
router.post('/create-tag', 
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateTag
)

router.get('/my-tags',
    middleware.stripToken,
    middleware.verifyToken,
    controller.GetMyTags
)

router.put('/update-tag/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateTag
)

router.delete('/delete-tag/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteTag
)

module.exports = router