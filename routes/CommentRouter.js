const router = require('express').Router()
const controller = require('../controllers/commentController')
const middleware = require('../middleware')

// Public routes - no authentication required
router.get('/:letterId/comments', controller.GetCommentsByLetter)

// Protected routes - require authentication
router.post('/create-comment', 
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateComment
)

router.put('/update-comment/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateComment
)

router.delete('/delete-comment/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteComment
)

router.get('/:id',
  middleware.stripToken, 
  middleware.verifyToken, 
  controller.GetCommentById
)


module.exports = router