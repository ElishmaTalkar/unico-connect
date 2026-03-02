const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { getProjects, createProject } = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.post('/', auth, createProject);

module.exports = router;
