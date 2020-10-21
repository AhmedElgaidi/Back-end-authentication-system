// Core modules

// 3rd party modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');// it requires sessions

// Custom modules
const authRoutes = require('./routes/authRoutes');
const { checkUser } = require('./middlwares/authMiddleware');

//======================================
// Create my express app instance
const app = express();

//======================================
// Connect to database
const PORT = process.env.PORT || 5000;
const URI = 'mongodb+srv://elbotanist:elbotanist@cluster0.iujbk.mongodb.net/nodeDatabase?retryWrites=true&w=majority';
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})// this returns a promise
    .then(() => app.listen(PORT) && console.log(`Server is running on port ${PORT}...`))
    .catch(err => err.message);

//================================
// My middlewares

// (1) Register my view engine (ejs);
app.set('view engine', 'ejs');

// (2) To use URL params
// To access the url encoded data, and pass it to an object (body)
// So, we can use it req.body
app.use(express.urlencoded( { extended: true }));

// (3) static middleware: to serve files statically
app.use(express.static('public'));

// (4) It parses any json data sent over request into JS object in req.body object
// Which makes it easy to be accessible
app.use(express.json());

// (5) It's a middlware for parsing cookies attached to client side requests  
app.use(cookieParser());

// (6) It's a middlware for creating sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

// (6) It's middlware for flash messages
app.use(flash());

// express messages middlwares
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//======================================
// my routes middlewares
app.use(checkUser);
app.use(authRoutes);

// Cookies:
// It gives us a way of storing data in user's browser
// It could track user's activity by services like google activity
// How it works ?
// When a request sent to our server, we can make a cookie at that moment of time
// and decide what data and it's type that cookies could hold and how much cookies
// should last inside the browser befores it expires and automatically deleted.
// So, cookies are sent in the server response and the browser register it.
// Now every time the client sends a request to our server, the cookies will be attached
// to the request, so we can acess it on our server
// And on this concept we complete our authentication system by setting JWT in the cookie.
// But we have to take our consideration about security flaws (CSRF, Cross-site Request forgery)
// after using JWT inside cookies for authentication.
// Which means a malicious site takes a user's aukthenication cookie and make a request
// to our server pretending to be our user, if our user exposes a state changing endpoints
// (means POST /login => the browser doesn't automatically provide authenticaion cookie
// but the data sent over req body (email, password in our case), so no need for csrf-token)
// but in other endpoint as (PUT /edit-profile => it needs a csrf-token, becuase it's a state
// changing)
// then it's a security flaw and needs a csrf token
// JWT structure:
// (1) header, includes meta data such as used algorithm
// (2) payload, to indentify the user (eg. id)
// (3) signature, adds secret key (secret string) 
// JWT signing:
// when user succssfully sign up/ log in, our server generates a header and a payload
// based on the request and hash them, then hash them again with the secret key and 
// outputs a signuatre the token will be header.payload.signature but encoded in base64Url

// set cookies
// app.get('/set-cookies', (req, res) => {
//     const cookieOptions = {
//         maxAge: 1000 * 60 * 60 * 24, // session expires after 1 day
//         // secure: true // cookie only set if the connetion is https 
//         httpOnly: true// It makes cookies not accessible from the front-end (console)
//         // just used in the connection between browser and server 
//     };
//     // when setting a cookie, if it's new then it'll be added
//     // if not, then it get updated, just like local storage. 
//     res.cookie('newUser',true, cookieOptions);
//     res.cookie('is-good', false, cookieOptions)
//     res.send('cookie is set...')
// });
// // get cookies
// app.get('/read-cookies', (req, res) => {
//     res.send(req.cookies)
// });

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: 'NOT FOUND' })
});