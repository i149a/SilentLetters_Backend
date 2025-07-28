const User = require('../models/User')
const Letter = require('../models/Letter')
const Comment = require('../models/Comment')
const middleware = require('../middleware')
const { populate } = require('dotenv')

// Create a new comment on a letter Function
const CreateComment = async (req, res) => {
    try {
        const { content, letterId, isAnonymous } = req.body // Extract fields from the request body
        const userId = req.user?.id || res.locals?.payload?.id // Use consistent ID source

        // Validate required fields
        if (!content || !letterId)
            return res.status(400).json({ status: 'Error', msg: 'Content and letterId are required' })

        // Check if the Letter exists
        const letterExists = await Letter.exists({ _id: letterId });
        if (!letterExists)
            return res.status(404).json({ status: 'Error', msg: 'Letter not found' })

        // Create the comment
        const comment = await Comment.create({
            content,
            letter: letterId,
            author: isAnonymous ? null : userId
        })

        // Update Letter's comments array
        await Letter.findByIdAndUpdate(
            letterId,
            { $push: { comments: comment._id } },
            { new: true }
        )

        // Update User's comments array (if not anonymous)
        if (!isAnonymous && userId) {
            await User.findByIdAndUpdate(
                userId,
                { $push: { comments: comment._id } },
                { new: true }
            )
        }

        res.status(201).json(comment) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Error', msg: 'Failed to create comment' })
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
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve comments' })    
    }
}

// Update comment Function
const UpdateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body // Extract fields from the request body
        const userId = res.locals.payload.id

        // Find the comment
        const comment = await Comment.findById(id)
       
        // No comment found with this ID
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' })

        // Only the original author can update
        if (comment.author && comment.author.toString() !== userId)
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
        const userId = res.locals.payload.id

        // Find the comment
        const comment = await Comment.findById(id)
       
        // No comment found with this ID
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' })

        // Author can delete only their comment
        if (comment.author && comment.author.toString() !== userId)
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

        res.status(200).json({ message: 'Comment deleted successfully' })  // Sends success response 
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