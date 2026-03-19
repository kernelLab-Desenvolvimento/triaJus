const sqlite3 = require('sqlite3').verbose();

// Banco de dados SQLite
const db = new sqlite3.Database('./config/database/database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar com SQLite:', err.message);
    } else {
        console.log('Conectado ao SQLite.');
        initializeDatabase();
    }
});

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

module.exports = db;