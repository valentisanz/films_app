const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { VKEY } = require('../config')

module.exports.isAuth = (context) => {
    const token = context.req.headers.authorization

    if (token) {
        try {
            const user = jwt.verify(token, VKEY)
            return user
        } catch (error) {
            throw new AuthenticationError('Invalid/Expired token.')
        }
    }
    throw new AuthenticationError('Login to do this action.', {
        errors: 'Authorization header token must be provided.'
    })
}
module.exports.isAdmin = (context) => {
    const user = this.isAuth(context)
    if (!user.isAdmin) throw new AuthenticationError('Access denied.')
    return user
}