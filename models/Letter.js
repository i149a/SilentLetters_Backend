const mongoose = require('mongoose') // Import Mongoose 

// Letter Schema 
const letterSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String },
        isPublic: { type: Boolean, default: false }, // True = show it to public
        isAnonymous: { type: Boolean, default: false }, // True = show author name
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }]
    },
    { timestamps: true } // For "createdAt" & "updatedAt" fields whenever there is an update 
)

// To turn the regular schema into true model
const Letter = mongoose.model('Letter', letterSchema)

// To export the schema to be usen within the app
module.exports = Letter