const { query } = require('../config/db');
const { broadcast } = require('../websocket/wsServer');

const addComment = async (req, res, next) => {
    try {
        const { issueId } = req.params;
        const { body } = req.body;
        const authorId = req.user.id;

        // Verify issue exists and get workspace_id
        const issueResult = await query('SELECT workspace_id FROM issues WHERE id = $1', [issueId]);
        if (!issueResult.rows.length) return res.status(404).json({ error: 'Issue not found' });
        const workspaceId = issueResult.rows[0].workspace_id;

        const result = await query(
            `INSERT INTO comments (issue_id, author_id, body) VALUES ($1, $2, $3)
       RETURNING id, issue_id, author_id, body, created_at`,
            [issueId, authorId, body]
        );
        const comment = result.rows[0];

        // Enrich with author name
        const authorResult = await query('SELECT name FROM users WHERE id = $1', [authorId]);
        const enriched = { ...comment, author_name: authorResult.rows[0]?.name };

        // Broadcast to workspace
        broadcast(workspaceId, { type: 'COMMENT_ADDED', payload: { issueId, comment: enriched } });

        res.status(201).json(enriched);
    } catch (err) {
        next(err);
    }
};

const getComments = async (req, res, next) => {
    try {
        const { issueId } = req.params;
        const result = await query(
            `SELECT c.id, c.issue_id, c.body, c.created_at, u.id as author_id, u.name as author_name
       FROM comments c
       JOIN users u ON u.id = c.author_id
       WHERE c.issue_id = $1
       ORDER BY c.created_at ASC`,
            [issueId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { addComment, getComments };
