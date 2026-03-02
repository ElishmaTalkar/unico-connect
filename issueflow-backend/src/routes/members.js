const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { getMembers } = require('../controllers/memberController');

router.get('/', auth, getMembers);

module.exports = router;
