const express = require('express');
const router = express.Router();
const dbUsers = require('../database/dbUsers');

// POST - Rota de Login
router.post('/login', (req, res) => {
    const { idUser, setor } = req.body;

    if (!idUser || !setor) {
        return res.status(400).json({ error: 'Usuário e setor são obrigatórios' });
    }

    // 1. Verifica se o usuário existe na tabela users
    const userQuery = `SELECT * FROM users WHERE idUser = ?`;
    dbUsers.get(userQuery, [idUser], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar banco de dados: ' + err.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        // 2. Verifica se o usuário tem permissão para o setor na tabela setores (incluindo acesso global '*')
        const setorQuery = `SELECT * FROM setores WHERE idUser = ? AND (setor = ? OR setor = '*')`;
        dbUsers.get(setorQuery, [idUser, setor], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao verificar setor: ' + err.message });
            }

            if (!row) {
                return res.status(403).json({ error: 'Usuário não tem autorização para conectar neste setor.' });
            }

            // 3. Registra o acesso na tabela login (REPLACE sobrescreve caso UNIQUE conflitante)
            const loginQuery = `INSERT OR REPLACE INTO login (idUser, setor) VALUES (?, ?)`;
            dbUsers.run(loginQuery, [idUser, setor], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao registrar login: ' + err.message });
                }

                // Responde com sucesso
                res.json({
                    success: true,
                    message: 'Login realizado com sucesso',
                    data: {
                        idUser,
                        setor,
                        loginId: this.lastID
                    }
                });
            });
        });
    });
});

// POST - Rota de Registro de novo usuário
router.post('/register', (req, res) => {
    const { nome, cpf, matricula, senha, setores, sudoUsuario, sudoSenha } = req.body;

    // Verificação de sudo
    const suUser = process.env.SUDO_USER || 'dev';
    const suPass = process.env.SUDO_PASS || 'dev';
    
    if (sudoUsuario !== suUser || sudoSenha !== suPass) {
        return res.status(401).json({ error: 'Autorização sudo negada. Credenciais Sudo incorretas.' });
    }

    if (!nome || !cpf || !matricula || !senha || !setores || setores.length === 0) {
        return res.status(400).json({ error: 'Preencha todos os campos e selecione os setores.' });
    }

    // Gerar idUser (Primeiro Nome + 4 Numeros Aleatórios)
    const primeiroNome = nome.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const numAleatorio = Math.floor(1000 + Math.random() * 9000);
    const idUser = `${primeiroNome}${numAleatorio}`;

    const query = `INSERT INTO users (nome, cpf, matricula, senha, idUser) VALUES (?, ?, ?, ?, ?)`;
    dbUsers.run(query, [nome, cpf, matricula, senha, idUser], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao registrar usuário: ' + err.message });
        }

        // Inserir todos os setores atrelados ao idUser
        const insertPromises = setores.map((setorSelecionado) => {
            return new Promise((resolve, reject) => {
                dbUsers.run(`INSERT INTO setores (setor, idUser) VALUES (?, ?)`, [setorSelecionado, idUser], (errSec) => {
                    if (errSec) reject(errSec);
                    else resolve();
                });
            });
        });

        Promise.all(insertPromises)
            .then(() => {
                res.json({
                    success: true,
                    message: 'Usuário registrado com sucesso',
                    data: { idUser }
                });
            })
            .catch(errSec => {
                res.status(500).json({ error: 'Erro ao associar setores: ' + errSec.message });
            });
    });
});

module.exports = router;
