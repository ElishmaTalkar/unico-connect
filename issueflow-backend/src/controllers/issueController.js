const { query } = require('../config/db');
const { broadcast } = require('../websocket/wsServer');

// Helper to build the enriched issue SELECT
const ISSUE_SELECT = `
  SELECT
    i.id, i.workspace_id, i.title, i.description, i.status, i.priority,
    i.created_at, i.updated_at,
    p.id AS project_id, p.name AS project_name, p.color AS project_color,
    a.id AS assignee_id, a.name AS assignee_name,
    r.id AS reporter_id, r.name AS reporter_name
  FROM issues i
  LEFT JOIN projects p ON p.id = i.project_id
  LEFT JOIN users a ON a.id = i.assignee_id
  LEFT JOIN users r ON r.id = i.reporter_id
`;

const verifyMember = async (workspaceId, userId) => {
    const mem = await query(
        'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
        [workspaceId, userId]
    );
    return mem.rows.length > 0;
};

const getIssues = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        const { q, project, priority, status, assignee } = req.query;
        const conditions = ['i.workspace_id = $1'];
        const values = [workspaceId];
        let idx = 2;

        if (q) { conditions.push(`i.title ILIKE $${idx++}`); values.push(`%${q}%`); }
        if (project) { conditions.push(`i.project_id = $${idx++}`); values.push(project); }
        if (priority) { conditions.push(`i.priority = $${idx++}`); values.push(priority); }
        if (status) { conditions.push(`i.status = $${idx++}`); values.push(status); }
        if (assignee) { conditions.push(`i.assignee_id = $${idx++}`); values.push(assignee); }

        const sql = `${ISSUE_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY i.created_at DESC`;
        const result = await query(sql, values);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

const getIssue = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        const result = await query(
            `${ISSUE_SELECT} WHERE i.id = $1 AND i.workspace_id = $2`,
            [id, workspaceId]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Issue not found' });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const createIssue = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        const { title, description, project_id, assignee_id, priority, status } = req.body;
        const insertResult = await query(
            `INSERT INTO issues (workspace_id, title, description, project_id, assignee_id, reporter_id, priority, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
            [workspaceId, title, description || null, project_id || null, assignee_id || null, userId, priority || 'medium', status || 'open']
        );
        const newId = insertResult.rows[0].id;
        const enriched = await query(`${ISSUE_SELECT} WHERE i.id = $1`, [newId]);
        const issue = enriched.rows[0];
        broadcast(workspaceId, { type: 'ISSUE_CREATED', payload: issue });
        res.status(201).json(issue);
    } catch (err) {
        next(err);
    }
};

const updateIssue = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        const fields = ['title', 'description', 'project_id', 'assignee_id', 'priority', 'status'];
        const updates = [];
        const values = [];
        let idx = 1;
        for (const f of fields) {
            if (req.body[f] !== undefined) {
                updates.push(`${f} = $${idx++}`);
                values.push(req.body[f]);
            }
        }
        if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
        values.push(id, workspaceId);
        await query(
            `UPDATE issues SET ${updates.join(', ')} WHERE id = $${idx++} AND workspace_id = $${idx++}`,
            values
        );
        const enriched = await query(`${ISSUE_SELECT} WHERE i.id = $1`, [id]);
        if (!enriched.rows.length) return res.status(404).json({ error: 'Issue not found' });
        const issue = enriched.rows[0];
        broadcast(workspaceId, { type: 'ISSUE_UPDATED', payload: issue });
        res.json(issue);
    } catch (err) {
        next(err);
    }
};

const deleteIssue = async (req, res, next) => {
    try {
        const { workspaceId, id } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        await query('DELETE FROM issues WHERE id = $1 AND workspace_id = $2', [id, workspaceId]);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

const exportCSV = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.id;
        if (!(await verifyMember(workspaceId, userId))) {
            return res.status(403).json({ error: 'Not a member' });
        }
        const { q, project, priority, status, assignee } = req.query;
        const conditions = ['i.workspace_id = $1'];
        const values = [workspaceId];
        let idx = 2;
        if (q) { conditions.push(`i.title ILIKE $${idx++}`); values.push(`%${q}%`); }
        if (project) { conditions.push(`i.project_id = $${idx++}`); values.push(project); }
        if (priority) { conditions.push(`i.priority = $${idx++}`); values.push(priority); }
        if (status) { conditions.push(`i.status = $${idx++}`); values.push(status); }
        if (assignee) { conditions.push(`i.assignee_id = $${idx++}`); values.push(assignee); }

        const sql = `${ISSUE_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY i.created_at DESC`;
        const result = await query(sql, values);

        const header = 'ID,Title,Project,Priority,Status,Assignee,Reporter,Created At,Updated At\n';
        const rows = result.rows.map((r) => [
            r.id,
            `"${(r.title || '').replace(/"/g, '""')}"`,
            `"${(r.project_name || '').replace(/"/g, '""')}"`,
            r.priority,
            r.status,
            `"${(r.assignee_name || '').replace(/"/g, '""')}"`,
            `"${(r.reporter_name || '').replace(/"/g, '""')}"`,
            r.created_at,
            r.updated_at,
        ].join(',')).join('\n');

        const today = new Date().toISOString().split('T')[0];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="issues-${today}.csv"`);
        res.send(header + rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { getIssues, getIssue, createIssue, updateIssue, deleteIssue, exportCSV };
