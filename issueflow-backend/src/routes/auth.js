const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const signupRules = {
    name: { regex: /^[a-zA-Z\s'\-]{2,80}$/, message: 'Name must be 2-80 letters' },
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        message: 'Password must be at least 8 chars with uppercase, lowercase, number and special character',
    },
};

const loginRules = {
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    password: { regex: /.{1,}/, message: 'Password is required' },
};

router.post('/signup', validate(signupRules), signup);
router.post('/login', validate(loginRules), login);
router.get('/me', auth, me);

module.exports = router;
