const express = require('express')
const logger = require('morgan')
const cors = require('cors')

// Import Routers
const AuthRouter = require('./routes/AuthRouter')
const UserRouter = require('./routes/UserRouter')
const LetterRouter = require('./routes/LetterRouter')
const CommentRouter = require('./routes/CommentRouter')
const TagRouter = require('./routes/TagRouter')

const PORT = process.env.PORT || 3001

// Connect to MongoDB
const db = require('./DB')

const app = express()

// Middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Mount routers
app.use('/auth', AuthRouter)
app.use('/letters', LetterRouter)
app.use('/letters', CommentRouter)
app.use('/tags', TagRouter)
app.use('/profile', UserRouter)

app.use('/test', (req, res) => {
  res.send('Connected!')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})