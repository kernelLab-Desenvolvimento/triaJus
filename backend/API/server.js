const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const os = require('os');
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Banco de dados SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar com SQLite:', err.message);
    } else {
        console.log('Conectado ao SQLite.');
        initializeDatabase();
    }
});

// ✅ SERVIR ARQUIVOS ESTÁTICOS (Adicione esta linha)
app.use(express.static(path.join(__dirname, '../../')));

// Suas outras rotas e configurações...

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://10.0.0.157:${PORT}/index.html`);
});

app.use(cors());

// Inicializar tabelas
function initializeDatabase() {
    db.serialize(() => {
        // Tabela audiencia
        db.run(`CREATE TABLE IF NOT EXISTS audiencia (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket TEXT NOT NULL,
            CPF TEXT NOT NULL,
            servico TEXT NOT NULL,
            horario TEXT NOT NULL,
            req TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela consulta
        db.run(`CREATE TABLE IF NOT EXISTS consulta (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket TEXT NOT NULL,
            CPF TEXT NOT NULL,
            servico TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela servicoSocial
        db.run(`CREATE TABLE IF NOT EXISTS servicoSocial (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket TEXT NOT NULL,
            CPF TEXT NOT NULL,
            servico TEXT NOT NULL,
            horario TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela chamada
        db.run(`CREATE TABLE IF NOT EXISTS chamada (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = {
    audiencia: new Set(),
    consulta: new Set(),
    servicoSocial: new Set(),
    chamada: new Set()
};

wss.on('connection', (ws, request) => {
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type && clients[data.type]) {
                // Adiciona cliente ao grupo específico
                clients[data.type].add(ws);
                ws.tableType = data.type;
                console.log(`Cliente adicionado ao grupo: ${data.type}`);
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
        }
    });

    ws.on('close', () => {
        if (ws.tableType && clients[ws.tableType]) {
            clients[ws.tableType].delete(ws);
        }
    });
});

// Função para broadcast para um grupo específico
function broadcastToTable(table, data) {
    if (clients[table]) {
        clients[table].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

//Envia o acesso ao banco e a broadcastToTable funcao pela request 
app.use((req, res, next) => {
    req.db = db;
    console.log(db)
    req.broadcastToTable = broadcastToTable;
    next();
});
//Importa Rotas de usersrouter
const usersRoutes = require('./routes/usersrouter');
// Rotas da API
app.use('/', usersRoutes);



app.listen(PORT, () => {
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    
    // Coletar todos os IPs
    for (const interfaceName in networkInterfaces) {
        for (const interface of networkInterfaces[interfaceName]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                addresses.push(interface.address);
            }
        }
    }
    
    console.log('=== SERVIDOR INICIADO ===');
    console.log(`📡 Servidor rodando na porta: ${PORT}`);
    console.log(`🌐 WebSocket rodando na porta: 8080`);
    console.log(`🖥️  IPs disponíveis:`);
    addresses.forEach(ip => {
        console.log(`   → http://${ip}:${PORT}`);
    });
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📁 Diretório do servidor: ${__dirname}`);
    console.log('==========================');
});