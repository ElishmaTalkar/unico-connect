require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { init: initWS } = require('./src/websocket/wsServer');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initWS(server);

server.listen(PORT, () => {
    console.log(`IssueFlow backend running on http://localhost:${PORT}`);
});
