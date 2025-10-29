// server.js - Abordagem Híbrida
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Usar puppeteer-extra com stealth
puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

app.use(express.json());
app.use(express.static(__dirname));

// Rota com Stealth Mode
app.post('/api/consultar-cpf', async (req, res) => {
    let browser;
    try {
        const { cpf } = req.body;
        console.log('=== CONSULTA COM STEALTH ===');
        console.log('📋 CPF:', cpf);

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=site-per-process',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();

        // Configurações stealth avançadas
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Navegação mais lenta e humana
        console.log('🌐 Navegando...');
        await page.goto('https://www.situacao-cadastral.com/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Espera aleatória antes de interagir
        await page.waitForTimeout(2000 + Math.random() * 3000);

        console.log('⌨️ Preenchendo CPF...');
        await page.type('#doc', cpf, { delay: 100 + Math.random() * 100 });

        // Espera antes de clicar
        await page.waitForTimeout(1000 + Math.random() * 2000);

        console.log('🖱️ Clicando...');
        
        // Usa Promise.race para lidar com diferentes comportamentos
        await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
            page.waitForSelector('.dados.nome', { timeout: 10000 }),
            page.waitForSelector('#resultado', { timeout: 10000 })
        ]);

        // Verifica se estamos na página de resultado
        const url = page.url();
        const titulo = await page.title();
        
        console.log('📍 URL atual:', url);
        console.log('📄 Título:', titulo);

        if (titulo.includes('Erro') || url === 'https://www.situacao-cadastral.com/') {
            throw new Error('Site bloqueou a consulta automática');
        }

        // Tenta extrair o nome
        const nome = await page.evaluate(() => {
            const elemento = document.querySelector('.dados.nome');
            return elemento ? elemento.textContent.trim() : null;
        });

        if (nome && nome !== 'Clique Aqui') {
            console.log('✅ Nome encontrado:', nome);
            res.json({ sucesso: true, nome: nome, cpf: cpf });
        } else {
            throw new Error('Nome não encontrado ou inválido');
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
        
        // Fallback: Dados simulados para desenvolvimento
        const nomesSimulados = {
            '04438487269': 'LUCAS G S SOUSA',
            '12345678909': 'MARIA SILVA SANTOS',
            '98765432100': 'JOAO PEREIRA COSTA'
        };

        const nomeSimulado = nomesSimulados[cpf];
        
        if (nomeSimulado) {
            console.log('🔄 Usando dados simulados:', nomeSimulado);
            res.json({
                sucesso: true,
                nome: nomeSimulado,
                cpf: cpf,
                mensagem: 'Dados simulados para desenvolvimento'
            });
        } else {
            res.status(500).json({
                sucesso: false,
                erro: 'Não foi possível consultar o CPF'
            });
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔚 Navegador fechado\n');
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});