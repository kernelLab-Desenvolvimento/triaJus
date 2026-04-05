import { API_BASE_URL, showError } from '/src/javascrip/config.js';

class FilaAtendimento {
    constructor() {
        this.sec = localStorage.getItem('section');
        this.ws = null;
        this.sessaoSelecionada = '08:00';
        this.dadosFila = [];
        this.init();
    }

    init() {
        this.configurarWebSocket();
        this.configurarEventListeners();
        this.carregarDadosIniciais();
    }

    configurarWebSocket() {
        console.log("section: ", this.sec);
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('✅ WebSocket conectado');
            this.ws.send(JSON.stringify({ type: this.sec }));
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Mensagem WebSocket:', data);
                
                if (data.type === 'NEW_RECORD' && data.table === this.sec) {
                    this.adicionarNaFila(data.data);
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

    configurarEventListeners() {
        const selectSessao = document.querySelector('.selecionar-interno');
        selectSessao.addEventListener('change', (e) => {
            this.sessaoSelecionada = e.target.value;
            this.filtrarPorSessao();
        });

        const btnConfirmar = document.getElementById('select');
        btnConfirmar.addEventListener('click', () => {
            this.filtrarPorSessao();
        });

        const btnChamar = document.getElementById('chamar');
        btnChamar.addEventListener('click', () => {
            this.chamarProximo();
        });
    }

    async carregarDadosIniciais() {
        try {
            const response = await fetch(`${API_BASE_URL}/${this.sec}`);
            const result = await response.json();
            
            if (result.data) {
                this.dadosFila = result.data;
                this.filtrarPorSessao();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
            showError('Erro ao carregar fila de atendimento');
        }
    }

    adicionarNaFila(novoRegistro) {
        const existe = this.dadosFila.some(item => item.ID === novoRegistro.ID);
        
        if (!existe) {
            this.dadosFila.unshift(novoRegistro);
            this.filtrarPorSessao();
        }
    }

    filtrarPorSessao() {
        const sec = localStorage.getItem('section');
        
        let dadosFiltrados = null;
        if (sec !== "consulta") {
            dadosFiltrados = this.dadosFila.filter(item => 
                item.horario === this.sessaoSelecionada
            );
        } else {
            dadosFiltrados = this.dadosFila;
        }

        const dadosParaExibir = dadosFiltrados.slice(0, 6);
        this.atualizarTabela(dadosParaExibir);
    }

    atualizarTabela(dados) {
        for (let i = 0; i < 6; i++) {
            document.getElementById(`nome${i}`).textContent = '-';
            document.getElementById(`intima${i}`).textContent = '-';
            document.getElementById(`cpf${i}`).textContent = '-';
            document.getElementById(`sessao${i}`).textContent = '-';
        }

        dados.forEach((item, index) => {
            document.getElementById(`nome${index}`).textContent = '-';
            document.getElementById(`intima${index}`).textContent = item.req || '-';
            document.getElementById(`cpf${index}`).textContent = this.formatarCPF(item.CPF);
            document.getElementById(`sessao${index}`).textContent = item.horario || '-';
        });
    }

    chamarProximo() {
        if (this.dadosFila.length === 0) {
            showError('Não há pessoas na fila');
            return;
        }

        const proximo = this.dadosFila.find(item => 
            item.horario === this.sessaoSelecionada
        );

        if (proximo) {
            // ✅ Registra ANTES de remover da fila (passa objeto completo)
            this.registrarChamada(proximo);

            // Remove da fila local
            this.dadosFila = this.dadosFila.filter(item => item.ID !== proximo.ID);
            this.filtrarPorSessao();

            showError(`Chamando: ${proximo.ticket}`);
        } else {
            showError('Não há mais pessoas nesta sessão');
        }
    }

    // ✅ Recebe objeto completo com ticket, horario e servico
    async registrarChamada(registro) {
        try {
            const response = await fetch(`${API_BASE_URL}/chamada`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket:  registro.ticket,
                    horario: registro.horario || '',
                    servico: registro.servico || ''
                })
            });
            const result = await response.json();
            console.log('✅ Chamada registrada:', result);
        } catch (error) {
            console.error('❌ Erro ao registrar chamada:', error);
        }
    }

    formatarCPF(cpf) {
        if (!cpf) return '-';
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    destroy() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.filaAtendimento = new FilaAtendimento();
});