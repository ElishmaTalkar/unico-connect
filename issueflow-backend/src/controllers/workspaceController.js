const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { broadcast } = require('../websocket/wsServer');

const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
};

const createWorkspace = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        let code = generateCode();
        // Ensure code uniqueness
        let exists = await query('SELECT id FROM workspaces WHERE code = $1', [code]);
        while (exists.rows.length > 0) {
            code = generateCode();
            exists = await query('SELECT id FROM workspaces WHERE code = $1', [code]);
        }
        const ws = await query(
            'INSERT INTO workspaces (name, code, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [name, code, userId]
        );
        const workspace = ws.rows[0];
        // Automatically add owner as admin member
        await query(
            'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)',
            [workspace.id, userId, 'admin']
        );
        // Create 4 default projects
        const defaultProjects = [
            { name: 'Frontend', color: '#6366f1' },
            { name: 'Backend', color: '#0ea5e9' },
            { name: 'Mobile', color: '#10b981' },
            { name: 'DevOps', color: '#f59e0b' },
        ];
        for (const p of defaultProjects) {
            await query('INSERT INTO projects (workspace_id, name, color) VALUES ($1, $2, $3)', [workspace.id, p.name, p.color]);
        }
        res.status(201).json(workspace);
    } catch (err) {
        next(err);
    }
};

const joinWorkspace = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;
        const wsResult = await query('SELECT * FROM workspaces WHERE code = $1', [code]);
        if (!wsResult.rows.length) {
            return res.status(404).json({ errors: [{ field: 'code', message: 'Workspace not found' }] });
        }
        const workspace = wsResult.rows[0];
        // Check not already a member
        const memCheck = await query(
            'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
            [workspace.id, userId]
        );
        if (memCheck.rows.length > 0) {
            // Already a member — just return the workspace
            return res.json(workspace);
        }
        await query(
            'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)',
            [workspace.id, userId, 'member']
        );
        res.json(workspace);
    } catch (err) {
        next(err);
    }
};

const getWorkspace = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        // Verify membership
        const mem = await query(
            'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
            [workspaceId, userId]
        );
        if (!mem.rows.length) return res.status(403).json({ error: 'Not a member of this workspace' });
        const ws = await query('SELECT * FROM workspaces WHERE id = $1', [workspaceId]);
        if (!ws.rows.length) return res.status(404).json({ error: 'Workspace not found' });
        res.json(ws.rows[0]);
    } catch (err) {
        next(err);
    }
};

const getUserWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const workspaces = await query(
            `SELECT w.*, wm.role, wm.joined_at 
             FROM workspaces w 
             JOIN workspace_members wm ON wm.workspace_id = w.id 
             WHERE wm.user_id = $1 
             ORDER BY wm.joined_at DESC`,
            [userId]
        );
        res.json(workspaces.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { createWorkspace, joinWorkspace, getWorkspace, getUserWorkspaces };
