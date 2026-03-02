const { query } = require('../config/db');

const getProjects = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        const mem = await query(
            'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
            [workspaceId, userId]
        );
        if (!mem.rows.length) return res.status(403).json({ error: 'Not a member' });
        const result = await query(
            'SELECT * FROM projects WHERE workspace_id = $1 ORDER BY created_at ASC',
            [workspaceId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

const createProject = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const { name, color } = req.body;
        const result = await query(
            'INSERT INTO projects (workspace_id, name, color) VALUES ($1, $2, $3) RETURNING *',
            [workspaceId, name, color || '#6366f1']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = { getProjects, createProject };
