const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const mongoose = require('mongoose')

const PORT = 4000
const { DATABASEURL } = require('./config')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})
mongoose
    .connect(DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`🎇  Database OK`)
        return server.listen({ port: PORT })
    })
    .then(res => {
        console.log(`🚀  Server ready at ${res.url}`)
    })
    .catch((error) => {
        console.log(error)
    })
