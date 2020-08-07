const User = require('../models/User')
const Film = require('../models/Film')
const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { isAuth, isAdmin } = require('../utils/auth')
const { VKEY } = require('../config')
const { validateRegisterInput, validateLoginInput } = require('../utils/validations')

function generateToken(user) {
    return jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        filmsList: user.filmsList
    }, VKEY, { expiresIn: '8h' })

}
module.exports = {
    Query: {
        async getUsers(_, { email }, context) {
            const user = isAuth(context)
            if (email != user.email) isAdmin(context)
            try {
                var users = []
                if (!email) users = await User.find().sort({ username: 1 })
                if (email) users = await User.find({ email }).sort({ username: 1 })
                return users
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async login(_, { email, password }) {
            const { errors } = validateLoginInput(email, password)
            const user = await User.findOne({ email })
            if (!user) {
                errors.general = "Invalid credentials"
                throw new UserInputError('Invalid credentials', { errors })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = "Invalid credentials"
                throw new UserInputError('Invalid credentials', { errors })
            }
            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_,
            {
                registerInput: { username, email, password, confirmPassword }
            }, ) {
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) throw new UserInputError('Errors', { errors })

            const usernameCheck = await User.findOne({ username })
            if (usernameCheck) throw new UserInputError('Username or email already registered, try another one.', {
                errors: {
                    register: 'Username or email already registered, try another one.'
                }
            })

            const emailCheck = await User.findOne({ email })
            if (emailCheck) throw new UserInputError('Username or email already registered, try another one.', {
                errors: {
                    register: 'Username or email already registered, try another one.'
                }
            })

            const hashedPassword = bcrypt.hashSync(password, 12)
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                createdAt: new Date().toString(),
                isAdmin: false
            })
            let user, token
            try {
                user = await newUser.save()
                token = generateToken(user)


            } catch (err) {
                console.log(err + ' an error occured.')
            }

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async deleteUser(_, { username }, context) {
            const user = isAuth(context)
            if (username != user.username) isAdmin(context)
            const userToDelete = await User.findOne({ username })
            if (!userToDelete) throw new UserInputError('User is not registered, try another one.')
            await userToDelete.delete()
            return 'User deleted successfully.'
        },
        async toggleFilmOfList(_, { title }, context) {
            let found = false
            const { id } = isAuth(context)
            const film = await Film.findOne({ title })
            if (!film) throw new UserInputError('Film not found.')
            const user = await User.findById(id)
            user.filmsList.forEach((data) => {
                if (data.title == title) found = true
            })
            found ? user.filmsList.forEach((data, index) => {
                if (data.title == title) user.filmsList.splice(index, 1)
            })
                : user.filmsList.push(film)
            await user.save()
            return {
                ...user._doc,
                id: user._id,
            }
        }
    }
}