const { model, Schema } = require('mongoose')
const  { filmSchema } = require('./Film')
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    filmsList: [{
        type: filmSchema
    }],
    isAdmin: Boolean,
    password: String,
    createdAt: { type: Date, default: Date.now }
})
module.exports = model('User', userSchema)