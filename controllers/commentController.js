const { Letter, User, Tag, Comment } = require('../models')
const middleware = require('../middleware')
const { populate } = require('dotenv')

// Create a new comment on a letter Function
const CreateComment = async (req, res) => {
    try {
        const { content, letterId, isAnonymous } = req.body // Extract fields from the request body

        // Create the comment
        const comment = await Comment.create({
            content,
            letter: letterId,
            author: isAnonymous ? null : req.user.id
        })

        // Push comment to the Letter
        await Letter.findByIdAndUpdate(letterId, {
            $push: { comments: comment._id }
        })

        // If not anonymous, push to User's comment
        if (!isAnonymous) {
            await User.findByIdAndUpdate(req.user.id, {
                $push: { comments: comment._id }
            })
        }

        res.status(201).json(comment) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to craete comment' })
    }
}

// Get all comments for a specific letter Function
const GetCommentsByLetter = async (req, res) => {
    try {
        const { letterId } = req.params

        // Find comments for the letter by Id
        const comments = await Comment.find({ letter: letterId })
            .populate('author', 'username picture')
            .sort({ createdAt: -1 })

        res.status(200).json(comments) // Sends success response 
    } catch (err) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve comments' })    
    }
}

// Update comment Function
const UpdateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body // Extract fields from the request body

        // Find the comment
        const comment = await Comment.findById(id)
       
        // No comment found with this ID
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' })

        // Only the original author can update
        if (comment.author && comment.author.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' })
    

        // Update comment content
        comment.content = content
        await comment.save()

        res.status(200).json(comment) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to update comment' }) 
    }
}

// Delete comment Function
const DeleteComment = async (req, res) => {
    try {
        const { id } = req.params

        // Find the comment
        const comment = await Comment.findById(id)
       
        // No comment found with this ID
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' })

        // Author can delete only their comment
        if (comment.author && comment.author.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' })

        // Delete comment
        await Comment.findByIdAndDelete(id)

        // Remove comment ID from Letter
        await Letter.findByIdAndUpdate(comment.letter, {
            $pull: { comments: id }
        })

        // Remove comment ID from User if not anonymous
        if (comment.author) {
            await User.findByIdAndUpdate(comment.author, {
                $pull: { comments: id }
        })
        }

        res.status(200).json({ message: 'Comment deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to delete comment' }) 
    }
}

module.exports = {
    CreateComment,
    GetCommentsByLetter,
    UpdateComment,
    DeleteComment
}