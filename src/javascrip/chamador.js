import { showError } from '/src/javascrip/config.js';

class ChamadaAtual {
    constructor() {
        this.ws = null;
        // Histórico das últimas 3 chamadas — índice 0 = mais recente
        this.historico = [null, null, null];
        this.init();
    }

    init() {
        this.configurarWebSocket();
        this.configurarEventListeners();
    }

    configurarWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:1234`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('✅ WebSocket conectado para chamadas');
            this.ws.send(JSON.stringify({ type: 'chamada' }));
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Mensagem WebSocket - Chamada:', data);
                
                if (data.type === 'NEW_RECORD' && data.table === 'chamada') {
                    this.adicionarChamada(data.data);
                }
            } catch (error) {
                console.error('❌ Erro ao processar mensagem WebSocket:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('🔴 WebSocket desconectado');
            setTimeout(() => this.configurarWebSocket(), 3000);
        };

        this.ws.onerror = (error) => {
            console.error('❌ Erro WebSocket:', error);
        };
    }

    adicionarChamada(dadosChamada) {
        this.historico = [dadosChamada, this.historico[0], this.historico[1]];
        console.log('✅ Histórico atualizado:', this.historico);
        this.atualizarTodosDisplays();
    }

    atualizarTodosDisplays() {
        this.atualizarDisplay(
            '.conteudo-principal .senha-numero',
            '.conteudo-principal .servico-container',
            '.conteudo-principal .horario-container .sessao-span',
            this.historico[0]
        );

        this.atualizarDisplay(
            '.conteudo-principal-1 .senha-numero-1',
            '.conteudo-principal-1 .servico-container',
            '.conteudo-principal-1 .horario-container-1 .sessao-span',
            this.historico[1]
        );

        this.atualizarDisplay(
            '.conteudo-principal-2 .senha-numero-2',
            '.conteudo-principal-2 .servico-container',
            '.conteudo-principal-2 .horario-container-2 .sessao-span',
            this.historico[2]
        );
    }

    // ✅ Método único — verifica !dados ANTES de acessar qualquer propriedade
    atualizarDisplay(seletorNumero, seletorServico, seletorHorario, dados) {
        const numeroEl  = document.querySelector(seletorNumero);
        const servicoEl = document.querySelector(seletorServico);
        const horarioEl = document.querySelector(seletorHorario);

        if (!dados) {
            if (numeroEl)  numeroEl.textContent  = '---';
            if (servicoEl) servicoEl.textContent = '-';
            if (horarioEl) horarioEl.textContent = '-';
            return;
        }

        if (numeroEl)  numeroEl.textContent  = dados.ticket || '000';
        if (servicoEl) servicoEl.textContent = this.obterTipoServico(dados.servico);
        if (horarioEl) horarioEl.textContent = dados.horario || '-';
    }

    obterTipoServico(tipo) {
        const tipos = {
            'audiencia':     'Audiência',
            'consulta':      'Consulta',
            'servicoSocial': 'Serviço Social',
        };
        return tipos[tipo] || 'Atendimento';
    }

    configurarEventListeners() {
        setInterval(() => this.atualizarDataHora(), 1000);
        this.atualizarDataHora();
    }

    atualizarDataHora() {
        const now = new Date();
        const dataFormatada = now.toLocaleDateString('pt-BR');
        const horaFormatada = now.toLocaleTimeString('pt-BR');

        const elementosData = document.querySelectorAll('.data-class, .data-class-1, .data-class-2');
        const elementosHora = document.querySelectorAll('.hora-class, .hora-class-1, .hora-class-2');

        elementosData.forEach(el => {
            const span = el.querySelector('span');
            if (span) span.textContent = dataFormatada;
        });

        elementosHora.forEach(el => {
            const span = el.querySelector('span');
            if (span) span.textContent = horaFormatada;
        });

        const dataHeader = document.getElementById('data');
        const horaHeader = document.getElementById('hora');
        if (dataHeader) dataHeader.textContent = dataFormatada;
        if (horaHeader) horaHeader.textContent = horaFormatada;
    }

    destroy() {
        if (this.ws) this.ws.close();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chamadaAtual = new ChamadaAtual();
});