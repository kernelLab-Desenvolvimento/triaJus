const express = require('express');
const router = express.Router();
const path = require('path');

const {dbAcess} = require('../middleware/database.middlewares')



// Rotas da API
// POST - Audiencia
router.post('/audiencia', dbAcess, (req, res) => {
    const { db, broadcastToTable } = req;
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
router.post('/consulta', dbAcess, (req, res) => {
    const { db, broadcastToTable } = req;
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
router.post('/servicosocial', dbAcess, (req, res) => {
    const { db, broadcastToTable } = req;
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
router.post('/chamada', dbAcess, (req, res) => {
    const { db, broadcastToTable } = req;
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
router.get('/:table', dbAcess, (req, res) => {
    const { db } = req;
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


module.exports = router;