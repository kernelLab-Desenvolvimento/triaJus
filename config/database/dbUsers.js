const sqlite3 = require('sqlite3').verbose();

// Banco de dados dbUsers SQLite
const dbUsers = new sqlite3.Database('./config/database/dbUsers.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar com dbUsers SQLite:', err.message);
    } else {
        console.log('Conectado ao dbUsers SQLite.');
        initializeDatabase();
    }
});

// Inicializar tabelas
function initializeDatabase() {
    dbUsers.serialize(() => {
        // Tabela usuarios
        dbUsers.run(`CREATE TABLE IF NOT EXISTS users (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cpf TEXT,
            matricula TEXT NOT NULL,
            senha TEXT,
            idUser TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela setores
        dbUsers.run(`CREATE TABLE IF NOT EXISTS setores (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            setor TEXT NOT NULL,
            idUser TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela login
        dbUsers.run(`CREATE TABLE IF NOT EXISTS login (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            idUser TEXT NOT NULL,
            setor TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Inserir dados de teste se a tabela users estiver vazia pra faciliar o teste inicial
        dbUsers.get(`SELECT COUNT(*) as count FROM users`, [], (err, row) => {
            if (!err && row.count === 0) {
                dbUsers.run(`INSERT INTO users (matricula, idUser) VALUES ('123456', 'admin')`);
                dbUsers.run(`INSERT INTO setores (setor, idUser) VALUES ('Triagem', 'admin')`);
                console.log('Usuário admin teste criado para o setor Triagem.');
            }
        });

        // Garantir que o usuário Dev com acesso a todos os setores sempre exista
        dbUsers.get(`SELECT COUNT(*) as count FROM users WHERE idUser = 'Dev'`, [], (err, row) => {
            if (!err && row.count === 0) {
                dbUsers.run(`INSERT INTO users (matricula, idUser) VALUES ('000000', 'Dev')`);
                dbUsers.run(`INSERT INTO setores (setor, idUser) VALUES ('*', 'Dev')`);
                console.log('Usuário Dev de acesso global criado.');
            }
        });
    });
}

module.exports = dbUsers;
