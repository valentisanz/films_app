const filmResolvers = require('./films')
const userResolvers = require('./users')
const directorResolvers = require('./directors')
const genreResolvers = require('./genres')


module.exports = {
    Query: {
        ...filmResolvers.Query,
        ...userResolvers.Query,
        ...directorResolvers.Query,
        ...genreResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...filmResolvers.Mutation,
        ...directorResolvers.Mutation,
        ...genreResolvers.Mutation,
    }
}