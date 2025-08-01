const User = require('../models/User')
const middleware = require('../middleware');

// Register Function
const Register = async (req, res) => {
    try {
        const { username, email, password, picture } = req.body // Extract fields from the request body

        // Validate the required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                status: 'Error', 
                msg: 'Username, email, and password are required' 
            });
        }


        let passwordDigest = await middleware.hashPassword(password) // Hash the provided password
        let existingUser = await User.findOne({ email }) // Check if a user with this email already exists

        if (existingUser) {
            return res.status(400).send('A user with that email has already been registered!')
        } else {
            // Create a new user
            const user = await User.create({
                username,
                email, 
                password: passwordDigest, 
                picture,
                letters: [],
                comments: [],
                tags: []
            })
            res.status(200).send(user) // Send the created user as a response
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'An error occurred while registering the user' })
    }
}

// Login Function
const Login = async (req, res) => {
    try {
        const { email, password } = req.body // Extract fields from the request body

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'Error', 
                msg: 'Email and password are required' 
            });
        }

        // Find the user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
        }

        let matched = await middleware.comparePassword(password, user.password) // Compare the provided password with the stored hash
        if (matched) {
            // Create a payload for the JWT token
            let payload = {
                id: user._id,
                email: user.email,
                username: user.username,
                picture: user.picture 
            }
            let token = middleware.createToken(payload) // Generate and send the token
            return res.status(200).send({ 
                user: payload,
                token,
                username: user.username,
                picture: user.picture
            })
        }
        res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
    } catch (error) {
        console.log(error)
        res.status(401).send({ status: 'Error', msg: 'An error has occurred logging in!' })
    }
}

// Signout Function
const Signout = async (req, res) => {
    // Since JWT is stateless, sign-out is typically handled client-side by discarding the token.
    // For completeness, we can return a success message.
    try {
        res.status(200).send({ status: 'Success', msg: 'User signed out successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Error', msg: 'An error occurred during sign-out' })
    }
}

// Update Password Function
const UpdatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body // Extract fields from the request body

        // Validate required fields
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                status: 'Error',
                msg: 'Both old and new passwords are required'
            });
        }

        const { payload } = res.locals // Get the user ID from the token payload (set by middleware)

        let user = await User.findById(payload.id) // Find the user by ID

        // Verify the old password
        let matched = await middleware.comparePassword(oldPassword, user.password)
        if (matched) {
            let passwordDigest = await middleware.hashPassword(newPassword) // Hash the new password and update the user
            user = await User.findByIdAndUpdate(payload.id, { password: passwordDigest }, { new: true })
            let updatedPayload = {
                id: user._id,
                email: user.email
            }
            return res.status(200).send({ status: 'Password Updated!', user: updatedPayload })
        }
        res.status(401).send({ status: 'Error', msg: 'Old Password did not match!' })
    } catch (error) {
        console.log(error)
        res.status(401).send({ status: 'Error', msg: 'An error has occurred updating password!' })
    }
}

// Forget Password Function
const ForgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body // Extract fields from the request body

        // Validate required fields
        if (!email || !newPassword) {
            return res.status(400).send({ 
                status: 'Error', 
                msg: 'Email and new password are required' 
            });
        }

        // Find user by email
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send({ status: 'Error', msg: 'User not found!'})
        }

        // Hashing the new passwors 
        let passwordDigest = await middleware.hashPassword(newPassword)

        // Update the user's password 
        user = await User.findByIdAndUpdate(
            user._id,
            { password: passwordDigest},
            { new: true }
        )
        return res.status(200).send({ status: 'Password Updated!', user: user })
    } catch (error) {
        console.log(error)
        res.status(401).send({ status: 'Error', msg: 'An error has occurred in resetting password!' })
    }
}

// Check Session Function
const CheckSession = async (req, res) => {
    const { payload } = res.locals
    const user = await User.findById(payload.id).select("username email picture")
    if (!user) {
        return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }
    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture
    })
}

module.exports = {
    Register,
    Login,
    Signout,
    UpdatePassword,
    ForgetPassword,
    CheckSession
}