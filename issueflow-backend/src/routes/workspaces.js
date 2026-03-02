const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createWorkspace, joinWorkspace, getWorkspace, getUserWorkspaces } = require('../controllers/workspaceController');

router.get('/', auth, getUserWorkspaces);
router.post('/', auth, validate({ name: { regex: /^.{2,80}$/, message: 'Name must be 2-80 chars' } }), createWorkspace);
router.post('/join', auth, validate({ code: { regex: /^[A-Z0-9]{6}$/, message: 'Invalid workspace code' } }), joinWorkspace);
router.get('/:workspaceId', auth, getWorkspace);

module.exports = router;
