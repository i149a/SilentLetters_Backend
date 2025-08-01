const User = require('../models/User')
const Letter = require('../models/Letter')
const Comment = require('../models/Comment')
const Tag = require('../models/Tag')
const middleware = require('../middleware')
const { populate } = require('dotenv')

// Create a new letter Function
const CreateLetter = async(req, res) => {
    try {
        const { title, content, image, isPublic, isAnonymous, tags } = req.body // Extract fields from the request body
        const { payload } = res.locals // Get the user ID from the token payload

        // Validate the required fields
        if (!title || !content)
            return res.status(400).json({ status: 'Error', msg: 'Title and content are required!'})

        // Create the letter
        const letter = await Letter.create({
            title,
            content,
            image,
            isPublic: isPublic || false,
            isAnonymous: isAnonymous || false,
            author: payload.id,
            tags: tags || [],
            comments: []
        })

        await User.findByIdAndUpdate(payload.id, { $push: { letters: letter._id } }) // Add the created letter to the user's list

        res.status(201).json(letter) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to craete letter' })
    }
}

// Get All Public Letters Function
const GetPublicLetters = async (req, res) => {
    try {
        // Find all letters marked as public
        const letters = await Letter.find({ isPublic: true })
            .populate('author', 'username picrture')
            .populate('tags', 'title images')
            .sort({ createdAt: -1 })

        res.status(200).json(letters) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to fetch public letters' })
    }
}

// Get a letter by ID Function
const GetLetterById = async (req, res) => {
    try {
        const { id } = req.params

        // Find letter by ID
        const letter = await Letter.findById(id)
            .populate('author', 'username picrture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username picture '}
            })
            .populate('tags', 'title image')

        // No letter found with this ID
        if (!letter)
            return res.status(404).json({ status: 'Error', msg: 'Letter not found'})

        res.status(200).json(letter) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve letter' })
    }
}

// Update an existing letter Function
const UpdateLetter = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, image, isPublic, isAnonymous, tags } = req.body // Extract fields from the request body
        const { payload } = res.locals // Get the user ID from the token payload

        // Find the letter
        const letter = await Letter.findById(id)

        // No letter found with this ID
        if (!letter)
            return res.status(404).json({ status: 'Error', msg: 'Letter not found' })

        // Only author can update the letter
        if (String(letter.author) !== String(payload.id))
            return res.status(403).json({ status: 'Error', msg: 'Unauthorized' })

        // Upadate fields
        letter.title = title || letter.title
        letter.content = content || letter.content
        letter.image = image || letter.image
        letter.isPublic = typeof isPublic === 'boolean' ? isPublic : letter.isPublic
        letter.isAnonymous = typeof isAnonymous === 'boolean' ? isAnonymous : letter.isAnonymous
        letter.tags = tags || letter.tags

        // Save upadted letter
        await letter.save()

        res.status(200).json(letter) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to update letter' }) 
    }
}

// Delete a letter Function
const DeleteLetter = async (req, res) => {
    try {
        const { id } = req.params
        const { payload } = res.locals // Get the user ID from the token payload

        // Find the letter
        const letter = await Letter.findById(id)

        // No letter found with this ID
        if (!letter)
            return res.status(404).json({ status: 'Error', msg: 'Letter not found'})

        // Only author can update the letter
        if (String(letter.author) !== payload.id)
            return res.status(403).json({ status: 'Error', msg: 'Unauthorized'})

        // Delete the letter
        await Letter.findByIdAndDelete(id)

        // Remove the letter from user's list
        await User.findByIdAndUpdate(payload.id, { $pull: { letters: id } })

        // Delete all comments related to the letter 
        await Comment.deleteMany({ letter: id })

        res.status(200).json({ status: 'Success', msg: 'Letter deleted' }) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to delete letter' }) 
    }
}

// Get My Letters Function
const GetMyLetters = async (req, res) => {
    try {
        const { payload } = res.locals // Get the user ID from the token payload

        // Find all letters where the author is current user
        const letters = await Letter.find({ author: payload.id })
            .populate('tags', 'title images')
            .sort({ createdAt: -1 })

        res.status(200).json(letters) // Sends success response 
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to retrieve your letters' }) 
    }
}

// Get Letters By Tag Function
const GetLettersByTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const letters = await Letter.find({ tags: tagId })
            .populate('author', 'username picture')
            .sort({ createdAt: -1 })

        res.status(200).json(letters)
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: 'Error', msg: 'Failed to fetch letters by tag' })
    }
}

module.exports = {
    CreateLetter,
    GetPublicLetters,
    GetLetterById,
    UpdateLetter,
    DeleteLetter,
    GetMyLetters,
    GetLettersByTag
}