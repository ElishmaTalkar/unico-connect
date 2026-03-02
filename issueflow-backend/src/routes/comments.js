const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { addComment, getComments } = require('../controllers/commentController');

router.get('/', auth, getComments);
router.post('/', auth, addComment);

module.exports = router;
