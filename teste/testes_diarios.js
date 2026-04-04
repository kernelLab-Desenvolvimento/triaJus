/**
 * QA Engine: Teste de Stress Diário Automático
 * Rode via: node teste/testes_diarios.js
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001/api';
const LOG_FILE = path.join(__dirname, 'system_reports.log');

// Logador nativo
function logEvent(mensagem) {
    const timestamp = new Date().toISOString();
    const texto = `[${timestamp}] ${mensagem}\n`;
    fs.appendFileSync(LOG_FILE, texto);
    console.log(texto.trim());
}

// Limpa o log antigo
if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
}
logEvent('🚀 INICIANDO TESTE DE ESTRESSE MASSIVO - TRIAJUS');

// Utilitário de Geração de CPF Fake válido estaticamente
function getFakeCpf(index) {
    const base = String(index).padStart(9, '0');
    return `${base}00`;
}

// Simulador de Pausa
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function simularDiaReal() {
    let ticketsGerados = [];

    logEvent('== ETAPA 1: Gerando Filas de Espera (Totem) ==');
    // Vamos gerar 10 civis pegando senhas de audiência, 10 consultas.
    for (let i = 1; i <= 10; i++) {
        try {
            // Civil 1 pedindo Audiência
            let res = await fetch(`${API_BASE}/audiencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf: getFakeCpf(i), req: 'INTIMADO', horario: '08:00' })
            });
            let data = await res.json();
            if (data.ticket) {
                ticketsGerados.push({ servico: 'audiencia', ticket: data.ticket, horario: '08:00' });
                logEvent(`✅ CIVIL ${i} - Ticket de Audiência Tirado: ${data.ticket}`);
            } else {
                logEvent(`❌ FALHA - Audiência Civil ${i}: ${JSON.stringify(data)}`);
            }

            // Civil 2 pedindo Consulta
            let resC = await fetch(`${API_BASE}/consulta`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf: getFakeCpf(i + 100) })
            });
            let dataC = await resC.json();
            if (dataC.ticket) {
                ticketsGerados.push({ servico: 'consulta', ticket: dataC.ticket });
                logEvent(`✅ CIVIL ${i+100} - Ticket Consulta Tirado: ${dataC.ticket}`);
            }
        } catch (e) {
            logEvent(`💀 INTERNAL ERROR - Falha de Conexão: ${e.message}`);
        }
        await sleep(200); // 200ms por pessoa no guichê (pra não derrubar a própria porta)
    }

    logEvent('== ETAPA 2: Operadores Chamando as Pessoas no Painel ==');
    await sleep(2000); // Pausa para simular troca pra tarde

    // Operador vai chamando quem tá na fila
    for (const item of ticketsGerados) {
        try {
            let resChamada = await fetch(`${API_BASE}/chamada`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket: item.ticket,
                    horario: item.horario || '',
                    servico: item.servico
                })
            });
            
            if (resChamada.ok) {
                logEvent(`🔊 ATENDIMENTO - Ticket ${item.ticket} chamado com SUCESSO pro guichê!`);
            } else {
                let errText = await resChamada.text();
                logEvent(`❌ ATENDIMENTO ERROR - Não conseguiu chamar o ticket ${item.ticket} (${errText})`);
            }
        } catch (e) {
            logEvent(`💀 INTERNAL ERROR API CHAMADA: ${e.message}`);
        }
        await sleep(300); // Operador dá um bip no botão
    }

    logEvent('🏁 Fim dos Testes de Estresse. Verifique os logs.');
}

// Dispara se conectar ao server
fetch('http://localhost:3001').then(() => {
    simularDiaReal();
}).catch(e => {
    logEvent('ERRO SEVERO: O Servidor TriaJus não está ligado na porta 3001. Ligue o sistema antes de rodar o teste!');
});
