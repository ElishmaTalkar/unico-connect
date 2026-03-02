const { query } = require('../config/db');

const getMembers = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        const mem = await query(
            'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
            [workspaceId, userId]
        );
        if (!mem.rows.length) return res.status(403).json({ error: 'Not a member' });
        const result = await query(
            `SELECT u.id, u.name, u.email, wm.role, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON u.id = wm.user_id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC`,
            [workspaceId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { getMembers };
