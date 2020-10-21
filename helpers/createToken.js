// Impor json web tokens
const jwt = require('jsonwebtoken');

const createToken = id => {
    const tokenOptions = {
        // it expectes the time in ms
        expiresIn: 1000 * 60 * 60 * 24 * 3 // 3 days
    }
    // sign our jwt
    // it takes our payload and secret key
    return jwt.sign({ id }, 'Esta es mi cadena secreta', tokenOptions);
};

module.exports = createToken;