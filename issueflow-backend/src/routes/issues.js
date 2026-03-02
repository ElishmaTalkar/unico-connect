const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { getIssues, getIssue, createIssue, updateIssue, deleteIssue, exportCSV } = require('../controllers/issueController');

router.get('/', auth, getIssues);
router.get('/export', auth, exportCSV);
router.get('/:id', auth, getIssue);
router.post('/', auth, createIssue);
router.patch('/:id', auth, updateIssue);
router.delete('/:id', auth, deleteIssue);

module.exports = router;
