const mongoose = require('mongoose') // Import Mongoose 

// Comment Schema 
const commentschema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        letter: { type: mongoose.Schema.Types.ObjectId, ref: 'Letter', required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false } // Required is false for anonymous option
    },
    { timestamps: true } // For "createdAt" & "updatedAt" fields whenever there is an update 
)

// To turn the regular schema into true model
const Comment = mongoose.model('Comment', commentschema)

// To export the schema to be usen within the app
module.exports = Comment