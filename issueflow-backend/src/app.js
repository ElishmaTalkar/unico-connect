require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/workspaces/:workspaceId/projects', require('./routes/projects'));
app.use('/api/workspaces/:workspaceId/members', require('./routes/members'));
app.use('/api/workspaces/:workspaceId/issues', require('./routes/issues'));
app.use('/api/workspaces/:workspaceId/issues/:issueId/comments', require('./routes/comments'));

app.use(errorHandler);

module.exports = app;
