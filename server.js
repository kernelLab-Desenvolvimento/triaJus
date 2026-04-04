const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

require('./config/websocket/websocket.js');

const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors());

// Rotas nomeadas antes do static: evita que pastas em public/ (ex.: /entrada) interceptem antes do sendFile
const usersRoutes = require('./config/routes/usersrouter');
const apiRoutes = require('./config/routes/apirouter.js');
const authRoutes = require('./config/routes/authrouter.js');
app.use('/', usersRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/config', express.static(path.join(__dirname, 'config')));



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
    console.log('=====Rotas Principais=====')
    console.log(`Tela de Operação:  http://localhost:${PORT}/entrada`);
    console.log(`Painel de Chamadas:  http://localhost:${PORT}/painel-de-chamada`);
    console.log(`Tela de Cadastro:  http://localhost:${PORT}`);
    console.log('==========================');
});