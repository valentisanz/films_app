const { model, Schema } = require('mongoose')
const { filmSchema } = require('./Film')

const directorSchema = new Schema({
    firstName: String,
    lastName: String,
    birthYear: Number,
    img:String,
    createdAt: { type: Date, default: Date.now },
    films:  [{
        type: filmSchema
    }]
})
module.exports = model('Director', directorSchema)
module.exports.directorSchema = directorSchema