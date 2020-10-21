const express = require('express');

// Import my controllers
const authControllers = require('../controllers/authControllers');

// Import our requireAuth middlware
const { requireAuth } = require('../middlwares/authMiddleware');

// Create my express router instance.
const router = express.Router();

//===========================================
// My routes
router.get('/', requireAuth, authControllers.index_get);
router.get('/signup', authControllers.signup_get);
router.post('/signup', authControllers.signup_post);
router.get('/login', authControllers.login_get);
router.post('/login', authControllers.login_post);
router.get('/logout', authControllers.logout_get);
router.get('/special', requireAuth , authControllers.personal_get);

// Export my router instance
module.exports = router;