const Genre = require('../models/Genre')
const { UserInputError } = require('apollo-server')
const { isAuth, isAdmin } = require('../utils/auth')

module.exports = {
    Query: {
        async getGenres(_, { genreName },context) {
            isAdmin(context)
            try {
                var genres = []
                if (!genreName) genres = await Genre.find().sort({ name: 1 })
                if (genreName) genres = await Genre.find({ genreName }).sort({ name: 1 })
                return genres
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createGenre(_, { genreName }, context) {
            isAdmin(context)
            const genre = await Genre.findOne({ genreName })
            if (genre) throw new UserInputError('Genre already exists, try another one.')
            const newGenre = new Genre({
                genreName
            })
            const res = await newGenre.save()

            return {
                ...res._doc,
                id: res._id,
            }
        }
    }
}