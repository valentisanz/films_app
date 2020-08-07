const { model, Schema } = require('mongoose')
const { filmSchema } = require('./Film')
const genreSchema = new Schema({
    genreName: {
        type: String,
        unique: true
    },
    films: [{
        type: filmSchema
    }],
    createdAt: { type: Date, default: Date.now }
})
module.exports = model('Genre', genreSchema)
