const Film = require('../models/Film')
const Director = require('../models/Director')
const Genre = require('../models/Genre')

const { validateFilm } = require('../utils/validations')
const { UserInputError } = require('apollo-server')
const { isAdmin } = require('../utils/auth')

module.exports = {
    Query: {
        async getFilms(_, { title }) {
            try {
                var films = [];
                if (!title) films = await Film.find().sort({ year: -1 })
                if (title) films = await Film.find({ title }).sort({ year: -1 })
                return films
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createFilm(_, { title, year, directorId, genreName, img, synopsis }, context) {
            isAdmin(context)
            const { errors, valid } = validateFilm(title, year)
            if (!valid) throw new UserInputError('Invalid film values.', { errors })
            const film = await Film.findOne({ title })
            if (film) throw new UserInputError('Film already exists, try another one.')
            const director = await Director.findById(directorId)
            if (!director) throw new UserInputError('Director not found.')
            const genre = await Genre.findOne({ genreName })
            if (!genre) throw new UserInputError('Genre not found.')
            
            const newFilm = new Film({
                title,
                year,
                img,
                director,
                genre,
                synopsis
            })
            const res = await newFilm.save()
            director.films.push(res)
            genre.films.push(res)
            await director.save()
            await genre.save()
            return {
                ...res._doc,
                id: res._id,
            }
        }
    }
}