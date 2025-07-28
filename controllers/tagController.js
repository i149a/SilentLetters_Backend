const User = require('../models/User')
const Tag = require('../models/Tag')
const middleware = require('../middleware')
const { populate } = require('dotenv')

// Create a new tag Function
const CreateTag = async (req, res) => {
    try {
        const userId = res.locals.payload.id
        const newTag = await Tag.create({ ...req.body, author: userId }) // Creating a new tag by the user Id

        // Add tag to user's tag list
        await User.findByIdAndUpdate(userId, {
            $push: { tags: newTag._id }
        })

        res.status(201).json(newTag) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to craete tag' })
    }
}

// Update a tag by Id Function
const UpdateTag = async (req, res) => {
    try {
        const { id } = req.params
        const updatedTag = await Tag.findByIdAndUpdate(id, req.body, { new: true }) // Find the tag by ID and update it

        res.status(200).json(updatedTag) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to update tag' }) 
    }
}

// Delete a tag Function
const DeleteTag = async (req, res) => {
    try {
        const { id } = req.params
        const deletedTag = await Tag.findByIdAndDelete(id) // Find the tag by ID and delete it from the database

        // Remove from user's tag list
        await User.findByIdAndUpdate(deletedTag.author, {
            $pull: { tags: deletedTag._id }
        })

        res.status(200).json({ message: 'Tag deleted successfully.' }) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to delete tag' }) 
    }
}

// Get my tags Function
const GetMyTags = async (req, res) => {
    try {
        const userId = res.locals.payload.id
        const myTags = await Tag.find({ author: userId }) // Find all tags created by user Id

        res.status(200).json(myTags) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve your tags' }) 
    }
}

// Get all tags Function
const GetAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find().populate('author', 'username') // Retrieve all tags
        res.status(200).json(allTags) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve all tags' }) 
    }
}

module.exports = {
    CreateTag,
    UpdateTag,
    DeleteTag,
    GetMyTags,
    GetAllTags
}