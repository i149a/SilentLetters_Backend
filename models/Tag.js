const mongoose = require('mongoose') // Import Mongoose 

// Tag Schema 
const tagschema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        image: { type: String },
        letters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true } // For "createdAt" & "updatedAt" fields whenever there is an update 
)

// To turn the regular schema into true model
const Tag = mongoose.model('Tag', tagschema)

// To export the schema to be usen within the app
module.exports = Tag