// Import our User model
const User = require('../models/User');

// Import our errors handlers
const errorHandler = require('../helpers/errorHandler');

// import our createToken function
const createToken = require('../helpers/createToken');

// Naming convention my MDN
// (1) index_get
// (2) signup_get
// (3) signup_post 
// (4) login_get
// (5) login_post
// (6) logout_get
// (7) personal_get

// (1)
const index_get = (req, res) => {
    res.render('index', { title: 'Home Page' });
};

// (2)
const signup_get = (req, res) => {
    res.render('signup', {title: 'Sign Up'})
};
// (3)
const signup_post = async (req, res) => {
    const { email, password } = req.body;
    try{
        // (1) create a new user
        // create method creates an instance for a user 
        const user = await User.create({ email, password });
        
        // (2) create a jwt to send it back to the browser in a cookie
        // to say this user is logged in, so subsequent requests will have that token
        const token = createToken(user._id);

        // (3) Add the created token to a cookie
        const cookieOptions = {
            httpOnly: true, // to prevent user from accessing it from the front end
            maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days in ms
        };
        res.cookie('jwt', token, cookieOptions);
        req.flash('mb-3 ml-3 py-3 px-3 message has-background-primary-light has-text-primary has-text-weight-semibold', `User is created successfully`);
        res.redirect('/special')
    } 
    catch(err){
        const errors = errorHandler(err);
        if (errors.email) {
            req.flash('mb-3 ml-3 py-3 px-3 message has-background-danger-light has-text-danger has-text-weight-semibold',  errors.email);
        }
        if (errors.password) {
            req.flash('mb-3 ml-3 py-3 px-3 message has-background-danger-light has-text-danger has-text-weight-semibold',  errors.password);
        } 
        res.redirect('/signup')
    }
};
// (4)
const login_get = (req, res) => {
    res.render('login', { title: 'Login Page' });
};
// (5)
const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        // let's used our created static method
        const user = await User.login(email, password);
        // after we're sure that the user is authenticated
        // let's give him a token
        const token = createToken(user._id);
        // add that created token to a cookie and sent it the browser
        const cookieOptions = {// lets's define cookie options
            httpOnly: true, // to prevent user from accessing it from the front end
            maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days in ms
        };
        res.cookie('jwt', token, cookieOptions);
        req.flash('mb-3 ml-3 py-3 px-3 message has-background-primary-light has-text-primary has-text-weight-semibold', `Logged in successfully`);
        res.redirect('/special');       
    }
    catch (err) {
        // console.log(err.message);
        const errors = errorHandler(err);
        console.log(errors);
        if (errors.email) {
            req.flash('mb-3 ml-3 py-3 px-3 message has-background-danger-light has-text-danger has-text-weight-semibold',  errors.email);
        }
        if (errors.password) {
            req.flash('mb-3 ml-3 py-3 px-3 message has-background-danger-light has-text-danger has-text-weight-semibold',  errors.password);
        }
        res.redirect('/login');
    }
};
// (6)
const logout_get = (req, res) => {
    // we can't delete a cookie
    // But we can make the maxAge very short
    res.cookie('jwt', '', {
        maxAge: 1
    });
    req.flash('mb-3 ml-3 py-3 px-3 message has-background-primary-light has-text-primary has-text-weight-semibold', `Logged out successfully`);
    res.redirect('/login');
};

const personal_get = (req, res) => {
    res.render('special', { title: 'Special Page' })
};

// export my controllers
module.exports = {
    index_get,
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
    personal_get
};