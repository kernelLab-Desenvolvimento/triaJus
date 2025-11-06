const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

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

// Rotas da API
// POST - Audiencia
app.post('/api/audiencia', (req, res) => {
    const { ticket, CPF, servico, horario, req: requisito } = req.body;
    
    const sql = `INSERT INTO audiencia (ticket, CPF, servico, horario, req) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [ticket, CPF, servico, horario, requisito], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const newRecord = {
            ID: this.lastID,
            ticket,
            CPF,
            servico,
            horario,
            req: requisito
        };
        
        // Broadcast via WebSocket
        broadcastToTable('audiencia', {
            type: 'NEW_RECORD',
            table: 'audiencia',
            data: newRecord
        });
        
        res.json({ 
            success: true, 
            message: 'Registro de audiência criado',
            data: newRecord
        });
    });
});

// POST - Consulta
app.post('/api/consulta', (req, res) => {
    const { ticket, CPF, servico } = req.body;
    
    const sql = `INSERT INTO consulta (ticket, CPF, servico) 
                 VALUES (?, ?, ?)`;
    
    db.run(sql, [ticket, CPF, servico], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const newRecord = {
            ID: this.lastID,
            ticket,
        
            CPF,
            servico
        };
        
        broadcastToTable('consulta', {
            type: 'NEW_RECORD',
            table: 'consulta',
            data: newRecord
        });
        
        res.json({ 
            success: true, 
            message: 'Registro de consulta criado',
            data: newRecord
        });
    });
});

// POST - ServicoSocial
app.post('/api/servicosocial', (req, res) => {
    const { ticket, CPF, servico, horario } = req.body;
    
    const sql = `INSERT INTO servicoSocial (ticket, CPF, servico, horario) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [ticket, CPF, servico, horario], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const newRecord = {
            ID: this.lastID,
            ticket,
        
            CPF,
            servico,
            horario
        };
        
        broadcastToTable('servicoSocial', {
            type: 'NEW_RECORD',
            table: 'servicoSocial',
            data: newRecord
        });
        
        res.json({ 
            success: true, 
            message: 'Registro de serviço social criado',
            data: newRecord
        });
    });
});

// POST - Chamada
app.post('/api/chamada', (req, res) => {
    const { ticket } = req.body;
    
    const sql = `INSERT INTO chamada (ticket) VALUES (?)`;
    
    db.run(sql, [ticket], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const newRecord = {
            ID: this.lastID,
            ticket
        };
        
        broadcastToTable('chamada', {
            type: 'NEW_RECORD',
            table: 'chamada',
            data: newRecord
        });
        
        res.json({ 
            success: true, 
            message: 'Registro de chamada criado',
            data: newRecord
        });
    });
});

// GET - Todas as tabelas
app.get('/api/:table', (req, res) => {
    const table = req.params.table;
    const validTables = ['audiencia', 'consulta', 'servicoSocial', 'chamada'];
    
    if (!validTables.includes(table)) {
        return res.status(404).json({ error: 'Tabela não encontrada' });
    }
    
    const sql = `SELECT * FROM ${table} ORDER BY created_at DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`WebSocket rodando na porta 8080`);
});