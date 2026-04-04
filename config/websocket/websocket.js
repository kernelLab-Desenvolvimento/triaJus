const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = {
    audiencia: new Set(),
    consulta: new Set(),
    servicoSocial: new Set(),
    chamada: new Set()
};

wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type && clients[data.type]) {
                clients[data.type].add(ws);
            }
        } catch (error) {
            console.error('Erro WebSocket:', error);
        }
    });

    ws.on('close', () => {
        for (const table in clients) {
            clients[table].delete(ws);
        }
    });
});

function broadcastToTable(table, data) {
    if (clients[table]) {
        clients[table].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

module.exports = { broadcastToTable };