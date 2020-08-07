const { model, Schema } = require('mongoose')
const filmSchema = new Schema({
    title: String,
    year: String,
    img: String,
    synopsis:String,
    createdAt: { type: Date, default: Date.now },
    director: {
        type: new Schema({
            firstName: String,
            lastName: String,
            birthYear: Number
        })
    },
    genre: {
        type: new Schema({
            genreName: String
        })
    }
})
module.exports = model('Film', filmSchema)
module.exports.filmSchema = filmSchema