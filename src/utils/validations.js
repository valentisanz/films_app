const isEmail = require('isemail')
module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    if (username.trim() === '') {
        errors.username = 'Username must not be empty.'
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty.'
    } else {
        if (!isEmail.validate(email)) {
            errors.email = 'Email must have a correct format.'
        }
    }
    if (password === '') {
        errors.password = 'Password must not be empty.'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match.'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}
module.exports.validateLoginInput = (email, password) => {
    const errors = {}

    if (email.trim() === '') {
        errors.email = 'Email must not be empty.'
    } else {
        if (!isEmail.validate(email)) {
            errors.email = 'Email must have a correct format.'
        }
    }
    if (password === '') {
        errors.password = 'Password must not be empty.'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
module.exports.validateFilm = (title, year) => {
    const errors = {}
    const yearParsed = parseInt(year)
    if (title === '') {
        errors.title = 'Title must not be empty.'
    }
    if (!yearParsed) {
        errors.year = 'Year must not be empty.'
    } else {
        if (yearParsed < 1800) {
            errors.year = 'Year must be higher.'
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
module.exports.validateDirector = (firstName, lastName) => {
    const errors = {}
    if (firstName === '') {
        errors.firstName = 'First name must not be empty.'
    }
    if (lastName === '') {
        errors.lastName = 'Last name must not be empty.'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
