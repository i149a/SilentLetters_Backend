const mongoose = require('mongoose') // Import Mongoose 
require('dotenv').config() // To allow extract & utilize the DB

// Connection 
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Successfully connected to MongoDB database . . .')
    } catch (error) {
        console.error('Connection Error!', error.message)
    }
}

connect() // To invoke the made function

module.exports = mongoose.connection // Exports the Mongoose connection 