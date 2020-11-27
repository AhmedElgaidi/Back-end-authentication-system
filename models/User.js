// ODM (Object Data Mapping) library
// It manages the relation between mongodb driver and node.js
const mongoose = require('mongoose');

// Import a func. from a validator package (A library of string validators and sanitizers)
const { isEmail } = require('validator');

const bcrypt = require('bcrypt');// For hashing

//====================================================
// Define User Schema
const Schema = mongoose.Schema;

// Let's structure our User Schema
const UserSchema = new Schema({
    email: {
        type: String,
        // For the seek of error handelling
        // we could add a custom error messages by writing message as a second element
        // in an array
        required: [true, 'Please, Enter your email address!'],
        unique: true,
        lowercase: true, // turn it to lowerCase before saving,
        // isEmail is a func. which takes the value and validate it
        // it it was't valid email the second message will be send.
        validate: [isEmail, 'Please, Enter your valid email!']
    },
    password: {
        type: String,
        required: [true, 'Please, Enter your password!'],
        minlength: [6, 'Password can\'t be less than 6 chars.']
    }
}, {
    timestamps: true
})// to add the live time for making or updating the document(User).

//========================================================================
// Mongoose hooks (Mongoose middleware just like express middlewares):
// A special functions which fire after a certain mongoose event happens
// which may be (save, validate, remove, updateOne, deleteOne)
// For example, we could make mongoose hook after creating, updating, deleting a document
// from our db  
// Let's get in action
// there are pre / post
// Fire a function after a document saved to db
// this hook is composed of event trigger (e.g save) and a callback func.
UserSchema.post('save', (doc, next) => {
    // console.log('A new doc is created\n', doc)
    // To go to the next middlware invoke next() for not making our server hanging
    // So, we always have to call it in every mongoose hook
    next();
});
// we could also use a hook before saving to db
UserSchema.pre('save', function (next) { // we can't pass doc becuase it's not created yet
    // If you want to use "this" keyword use the ordinary function not the arrow one
    // for making "this" accessible
    // console.log(this, '\nuser will save a new doc now ')// this refers to local version of doc
    // Go to the next middleware
    next()
});
// Now, I'll use the pre hook to hash user password before saving to database
// And, I'll use bcypt for that (to make pasword go though hashing Algorithm before saving)
// But hashing isn't enough (Despite of being irreverible), because hackers can get it
// So we need to generate something calld 'salt' to the string
UserSchema.pre('save', async function(next) {
    // Generate the salt
    const salt =  await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//==================================
// mongoose custom functions
// we can setup them either by using schema.statics.methodName or schema.mehtods.methodName
// So, what is the difference then?
// statics are defined on the model, while methods are defined on document (instance)
// for example
// static
// const rita = await Animal.findByName('rita')             // it returns the rita document
// methods
// const cats =  await rita.findBySimilarType()          // it returns all the documents (cats) that have 'cat' type
//=================================

// Let's create a static method to log user in
UserSchema.statics.login = async function(email, password) {// so we can use this
    // this now refers to user model not the user instance as previous
    const user = await this.findOne({ email });
    if (user) {
        // compare('not hashed yet', 'hased')
        // this is an async func. So, we'll use awiat to assign the value
        // And it's gonna be truthy if passwords matched
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
};

//=========================================================================
// Create a model based on previous schema
const User = mongoose.model('user', UserSchema);// 'user' must be singular
// because mongoose adds 's' to it and search in our db collections

// export our User model to use it anywhere
module.exports = User;
