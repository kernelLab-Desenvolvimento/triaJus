import { showError } from '../../scripts/config.js';

class ChamadaAtual {
    constructor() {
        this.ws = null;
        this.ultimaChamada = null;
        this.init();
    }

    init() {
        this.configurarWebSocket();
        this.configurarEventListeners();
    }

    configurarWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('✅ WebSocket conectado para chamadas');
            // Informa ao servidor que queremos escutar a tabela de chamada
            this.ws.send(JSON.stringify({ type: 'chamada' }));
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Mensagem WebSocket - Chamada:', data);
                
                if (data.type === 'NEW_RECORD' && data.table === 'chamada') {
                    this.atualizarChamadaAtual(data.data);
                }
            } catch (error) {
                console.error('❌ Erro ao processar mensagem WebSocket:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('🔴 WebSocket desconectado');
            // Tenta reconectar após 3 segundos
            setTimeout(() => this.configurarWebSocket(), 3000);
        };

        this.ws.onerror = (error) => {
            console.error('❌ Erro WebSocket:', error);
        };
    }

    configurarEventListeners() {
        // Atualiza data e hora a cada segundo
        setInterval(() => this.atualizarDataHora(), 1000);
        this.atualizarDataHora();
    }

    atualizarChamadaAtual(dadosChamada) {
        this.ultimaChamada = dadosChamada;
        
        // Atualiza os três displays
        this.atualizarDisplayPrincipal(dadosChamada);
        this.atualizarDisplaySecundario1(dadosChamada);
        this.atualizarDisplaySecundario2(dadosChamada);
        
        console.log('✅ Chamada atualizada:', dadosChamada);
    }

    atualizarDisplayPrincipal(dados) {
        // Display principal (section do meio)
        const numeroSequencial = document.querySelector('.conteudo-principal .senha-numero');
        const servicoDisplay = document.querySelector('.conteudo-principal .servico-container');
        const horarioSpan = document.querySelector('.conteudo-principal .horario-container span');
        
        if (numeroSequencial) {
            numeroSequencial.textContent = dados.ticket || '000';
        }
        
        if (servicoDisplay) {
            // Aqui você pode mapear o tipo de serviço se necessário
            servicoDisplay.textContent = this.obterTipoServico(dados.tipo);
        }
        
        if (horarioSpan && dados.horario) {
            horarioSpan.textContent = dados.horario;
        }
    }

    atualizarDisplaySecundario1(dados) {
        // Primeiro display secundário (section-1 primeiro)
        const numeroSequencial = document.querySelector('.conteudo-principal-1 .senha-numero-1');
        const servicoDisplay = document.querySelector('.conteudo-principal-1 .servico-container');
        const horarioSpan = document.querySelector('.conteudo-principal-1 .horario-container-1 span');
        
        if (numeroSequencial) {
            numeroSequencial.textContent = dados.ticket || '000';
        }
        
        if (servicoDisplay) {
            servicoDisplay.textContent = this.obterTipoServico(dados.tipo);
        }
        
        if (horarioSpan && dados.horario) {
            horarioSpan.textContent = dados.horario;
        }
    }

    atualizarDisplaySecundario2(dados) {
        // Segundo display secundário (section-1 segundo)
        const numeroSequencial = document.querySelector('.conteudo-principal-2 .senha-numero-2');
        const servicoDisplay = document.querySelector('.conteudo-principal-2 .servico-container');
        const horarioSpan = document.querySelector('.conteudo-principal-2 .horario-container-2 span');
        
        if (numeroSequencial) {
            numeroSequencial.textContent = dados.ticket || '000';
        }
        
        if (servicoDisplay) {
            servicoDisplay.textContent = this.obterTipoServico(dados.tipo);
        }
        
        if (horarioSpan && dados.horario) {
            horarioSpan.textContent = dados.horario;
        }
    }

    obterTipoServico(tipo) {
        // Mapeia o tipo para um nome mais amigável
        const tipos = {
            'audiencia': 'Audiência',
            'consulta': 'Consulta',
            'social': 'Serviço Social',
            'defensoria': 'Defensoria Pública'
        };
        
        return tipos[tipo] || 'Atendimento';
    }

    atualizarDataHora() {
        const now = new Date();
        
        // Formata a data
        const dataFormatada = now.toLocaleDateString('pt-BR');
        
        // Formata a hora
        const horaFormatada = now.toLocaleTimeString('pt-BR');
        
        // Atualiza todos os elementos de data e hora
        const elementosData = document.querySelectorAll('.data-class, .data-class-1, .data-class-2');
        const elementosHora = document.querySelectorAll('.hora-class, .hora-class-1, .hora-class-2');
        
        elementosData.forEach(elemento => {
            const span = elemento.querySelector('span');
            if (span) span.textContent = dataFormatada;
        });
        
        elementosHora.forEach(elemento => {
            const span = elemento.querySelector('span');
            if (span) span.textContent = horaFormatada;
        });
        
        // Atualiza também o header
        const dataHeader = document.getElementById('data');
        const horaHeader = document.getElementById('hora');
        
        if (dataHeader) dataHeader.textContent = dataFormatada;
        if (horaHeader) horaHeader.textContent = horaFormatada;
    }

    // Método para forçar uma atualização manual (se necessário)
    forcarAtualizacao() {
        if (this.ultimaChamada) {
            this.atualizarChamadaAtual(this.ultimaChamada);
        }
    }

    // Método para fechar conexão quando necessário
    destroy() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.chamadaAtual = new ChamadaAtual();
});