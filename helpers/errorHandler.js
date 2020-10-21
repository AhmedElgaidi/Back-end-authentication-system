// Error handling
const errorHandler = (err) => {
    // (1) Define our intial values
    let errors = { email: '', password: '' };
    
    // (5) Incorrect password when login process
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
        return errors;
    }
    // (4) Incorrect email when login process
    if (err.message === 'Incorrect email') {
        errors.email = 'Incorrect email';
        return errors;
    }
    // (3) Duplicate email errors
    if(err.code == 110000 || err.message.includes('11000' || 'E11000' || 'Duplicate key')) {// lets put this first
        // because we don't have to complete the test it the email is already taken
        errors.email = `Sorry, the email is already taken `;// update our errors object
        return errors;
    }
    
    // (2) Essential Validation errors
    if(err.message.includes('user validation failed')) {
        // Object.values returns the values in any array
        Object.values(err.errors).forEach(({ properties }) => {// Let's destructure it
            // let's update our errors object
            errors[properties.path] = properties.message;
        })
    }
    return errors;
};
module.exports = errorHandler;