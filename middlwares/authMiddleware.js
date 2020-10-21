const jwt = require('jsonwebtoken');
const User = require('../models/User');

// we are gonna apply this middlw are to any route we want to protect(require authentication)
const requireAuth = (req, res, next) => {
    // get the token
    const token = req.cookies.jwt;
    // (1) check if the token is present or not over the request
    if(token) {
        // Now, let's verify the token
        // jwt.verify(token, our secret key, callback)
        jwt.verify(token, 'Esta es mi cadena secreta', async(err, decodedToken) => {
            if (err) {
                await res.redirect('/signup');
            } else {
                // continue your middleware chaining
                next();
            }
        });
    } else {
        res.redirect('/signup');
    }
};
// Check user viability middleware
const checkUser = (req, res, next) => {
        // get the token
        const token = req.cookies.jwt;
        // (1) check if the token is present or not over the request
        if(token) {
            // Now, let's verify the token
            // jwt.verify(token, our secret key, callback)
            jwt.verify(token, 'Esta es mi cadena secreta', async (err, decodedToken) => {
                if (err) {
                    // if err happens the user will be undefined in our view
                    // so we'll give it null value
                    res.locals.user = null;
                    // if the token isn't verified, then pass the next middleware
                    next();
                } else {
                    // when we created the token, we generated it with the id
                    // so after decoding we can get the user from the decoded token
                    let user = await User.findById(decodedToken.id);
                    // In node we can access any variable we want from our view
                    // if we add it to locals
                    res.locals.user = user;// it's accessible now
                    // continue your middleware chaining
                    next();
                }
            });
        } else {
            res.locals.user = null;
            next();
        }
};

// Export these middlewares
module.exports = {
    requireAuth,
    checkUser
};