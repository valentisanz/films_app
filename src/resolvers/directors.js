const Director = require('../models/Director')
const { validateDirector } = require('../utils/validations')
const { UserInputError } = require('apollo-server')
const { isAuth, isAdmin } = require('../utils/auth')
module.exports = {
    Query: {
        async getDirectors(_, { firstName, lastName }, context) {
            isAuth(context)
            //console.log(context.req.headers)
            try {
                var directors = [];
                if (!lastName) directors = await Director.find({ firstName }).sort({ firstName: 1 })
                if (!firstName) directors = await Director.find({ lastName }).sort({ firstName: 1 })
                if (firstName && lastName) directors = await Director.find({ firstName, lastName }).sort({ firstName: 1 })
                if (!firstName && !lastName) directors = await Director.find().sort({ firstName: 1 })

                return directors
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createDirector(_, { firstName, lastName, birthYear, img }, context) {
            isAdmin(context)
            const { errors, valid } = validateDirector(firstName, lastName, birthYear)
            if (!valid) throw new UserInputError('Invalid director values.', { errors })

            const newDirector = new Director({
                firstName,
                lastName,
                img,
                birthYear,
            })

            const res = await newDirector.save()
            return {
                ...res._doc,
                id: res._id,
            }
        }
    }
}