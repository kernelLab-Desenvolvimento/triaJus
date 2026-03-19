const express = require('express');
const router = express.Router();
const path = require('path');


//GET - Tela de Entrada
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../', 'index.html'));
});


//GET - Tela de Operação
router.get('/entrada', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../', 'pages/page-chamada/html/01-authAt.html'));
});

//GET - Tela de Chamadas
router.get('/painel-de-chamada', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../', 'pages/page-Saida/html/chamador.html'));
});

module.exports = router;