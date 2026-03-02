const WebSocket = require('ws');

let wss = null;

// Map of workspaceId → Set of WebSocket clients
const rooms = new Map();

const init = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        // Expect client to send { type: 'JOIN', workspaceId } immediately
        ws.isAlive = true;
        ws.workspaceId = null;

        ws.on('pong', () => { ws.isAlive = true; });

        ws.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw);
                if (msg.type === 'JOIN' && msg.workspaceId) {
                    ws.workspaceId = msg.workspaceId;
                    if (!rooms.has(msg.workspaceId)) rooms.set(msg.workspaceId, new Set());
                    rooms.get(msg.workspaceId).add(ws);
                    ws.send(JSON.stringify({ type: 'JOINED', workspaceId: msg.workspaceId }));
                }
            } catch (_) { }
        });

        ws.on('close', () => {
            if (ws.workspaceId && rooms.has(ws.workspaceId)) {
                rooms.get(ws.workspaceId).delete(ws);
            }
        });
    });

    // Heartbeat to clean stale connections
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => clearInterval(interval));
};

const broadcast = (workspaceId, message) => {
    const clients = rooms.get(workspaceId);
    if (!clients) return;
    const payload = JSON.stringify(message);
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    }
};

module.exports = { init, broadcast };
