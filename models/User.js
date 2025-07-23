const mongoose = require('mongoose') // Import Mongoose 

// User Schema 
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        picture: { type: String },
        letters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
    },
    { timestamps: true } // For "createdAt" & "updatedAt" fields whenever there is an update 
)

// To turn the regular schema into true model
const User = mongoose.model('User', userSchema)

// To export the schema to be usen within the app
module.exports = User 