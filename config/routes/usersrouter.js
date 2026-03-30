const express = require('express');
const router = express.Router();
const path = require('path');


//GET - Tela de Entrada
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'public/index.html'));
});


//GET - Tela de Operação
router.get('/entrada', (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'public/entrada/01-auth.html'));
});

// GET - Tela de Atendimento
router.get('/atendimento', (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'public/admin/01-authAt.html'));
});

//GET - Tela de Chamadas
router.get('/painel-de-chamada', (req, res) => {
    res.sendFile(path.join(__dirname, '../../','public/chamada/chamador.html'));
});

module.exports = router;