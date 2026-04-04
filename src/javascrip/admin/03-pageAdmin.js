import { API_BASE_URL, showError } from '/src/javascrip/config.js';

class FilaAdmin {
    constructor() {
        this.currentSection = 'audiencia';
        this.currentLabel = 'AUDIÊNCIA';
        this.sessaoSelecionada = '08:00';
        this.dados = {
            audiencia: [],
            consulta: [],
            servicoSocial: [],
        };
        this.ws = null;
        this.init();
    }

    init() {
        this.cacheDom();
        this.bindEvents();
        this.setSection(this.currentSection, this.currentLabel);
        this.connectWebSocket();
        this.loadAllData();
    }

    cacheDom() {
        this.tabs = Array.from(document.querySelectorAll('.tab'));
        this.tituloLista = document.getElementById('titulo-lista');
        this.tabelaBody = document.getElementById('corpo-tabela');
        this.headerRow = document.getElementById('header-row');
        this.selectSessao = document.getElementById('selecao-sessao');
        this.sessionCard = document.getElementById('session-card');
        this.btnChamar = document.getElementById('select');
        this.btnSair = document.getElementById('sair');
    }

    bindEvents() {
        this.tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetSection = tab.dataset.section;
                const setorAcessoBruto = localStorage.getItem('setorLogado') || '';
                
                // Tratar normalização do texto
                const sectionMap = {
                    'Audiência': 'audiencia',
                    'Consulta': 'consulta',
                    'Serviço Social': 'servicoSocial',
                    'Administrador': 'administrador'
                };
                
                const setorKey = sectionMap[setorAcessoBruto];
                
                if (setorKey !== 'administrador' && setorKey !== targetSection) {
                    alert('VOCÊ ESTÁ TENTANDO ACESSAR DEPARTAMENTOS DO QUAL VOCÊ NÃO ESTÁ AUTORIZADO A OPERAR!');
                    
                    // Agenda notificação após 5 minutos (300.000 ms)
                    setTimeout(() => {
                        if (Notification.permission === 'granted') {
                            new Notification('Alerta do Sistema de Filas', {
                                body: `Tentativa detectada de furar jurisdição: Você logou em ${setorAcessoBruto} mas tentou acessar o relatório de ${targetSection}.`
                            });
                        } else if (Notification.permission !== 'denied') {
                            Notification.requestPermission().then(permission => {
                                if (permission === 'granted') {
                                    new Notification('Alerta do Sistema de Filas', {
                                        body: 'Tentativa não autorizada salva no log do sistema de fila.'
                                    });
                                }
                            });
                        }
                    }, 300000);
                    
                    return; // Bloqueia a troca de tab visualmente
                }

                this.setSection(targetSection, tab.dataset.label);
            });
        });

        this.selectSessao.addEventListener('change', (event) => {
            this.sessaoSelecionada = event.target.value;
            this.renderCurrentSection();
        });

        this.btnChamar.addEventListener('click', () => this.chamarProximo());
        this.btnSair.addEventListener('click', () => {
            window.location.href = '/admin/02-listAt.html';
        });
    }

    setSection(section, label) {
        this.currentSection = section;
        this.currentLabel = label;
        localStorage.setItem('section', section);
        this.tituloLista.textContent = label;

        this.tabs.forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.section === section);
        });

        const isConsulta = section === 'consulta';
        this.sessionCard.classList.toggle('hidden', isConsulta);
        this.atualizarCabecalhoTabela();
        this.renderCurrentSection();
    }

    async loadAllData() {
        await Promise.allSettled([
            this.loadSectionData('audiencia'),
            this.loadSectionData('consulta'),
            this.loadSectionData('servicoSocial'),
        ]);

        this.updateBadges();
        this.renderCurrentSection();
    }

    async loadSectionData(section) {
        try {
            const response = await fetch(`${API_BASE_URL}/${section}`);
            const result = await response.json();
            this.dados[section] = Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error(`Erro ao carregar ${section}:`, error);
            showError(`Erro ao carregar fila de ${section}`);
        }
    }

    connectWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            ['audiencia', 'consulta', 'servicoSocial'].forEach((section) => {
                this.ws.send(JSON.stringify({ type: section }));
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'NEW_RECORD' && this.dados[payload.table]) {
                    const exists = this.dados[payload.table].some((item) => item.ID === payload.data.ID);
                    if (!exists) {
                        this.dados[payload.table].unshift(payload.data);
                        this.updateBadges();
                        
                        // Emitir Alerta Sonoro Tonal
                        this.tocarAlerta();

                        if (payload.table === this.currentSection) {
                            this.renderCurrentSection();
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao processar mensagem WS:', error);
            }
        };

        this.ws.onclose = () => {
            setTimeout(() => this.connectWebSocket(), 3000);
        };
    }

    renderCurrentSection() {
        const lista = this.dados[this.currentSection] || [];
        const isConsulta = this.currentSection === 'consulta';
        const isAudiencia = this.currentSection === 'audiencia';
        const filtrados = isConsulta
            ? lista
            : lista.filter((item) => item.horario === this.sessaoSelecionada);

        const rows = filtrados.slice(0, 6);
        this.tabelaBody.innerHTML = '';

        for (let i = 0; i < 6; i += 1) {
            const item = rows[i];
            const tr = document.createElement('tr');
            const cpf = item ? this.formatarCPF(item.CPF) : '-';
            const coluna2 = this.currentSection === 'consulta'
                ? (item ? String(item.ticket || '-').padStart(3, '0') : '-')
                : (item ? (item.horario || '-') : '-');
            if (isAudiencia) {
                const intimacao = item ? (item.req || '-') : '-';
                tr.innerHTML = `<td>${cpf}</td><td>${intimacao}</td><td>${coluna2}</td>`;
            } else {
                tr.innerHTML = `<td>${cpf}</td><td>${coluna2}</td>`;
            }
            this.tabelaBody.appendChild(tr);
        }
    }

    atualizarCabecalhoTabela() {
        if (this.currentSection === 'audiencia') {
            this.headerRow.innerHTML = '<th>CPF</th><th>INTIMAÇÃO</th><th>SESSÃO</th>';
            return;
        }
        if (this.currentSection === 'consulta') {
            this.headerRow.innerHTML = '<th>CPF</th><th>SENHA</th>';
            return;
        }

        this.headerRow.innerHTML = '<th>CPF</th><th>SESSÃO</th>';
    }

    async chamarProximo() {
        const lista = this.dados[this.currentSection] || [];
        if (!lista.length) {
            showError('Nao ha pessoas na fila.');
            return;
        }

        const proximo = this.currentSection === 'consulta'
            ? lista[0]
            : lista.find((item) => item.horario === this.sessaoSelecionada);

        if (!proximo) {
            showError('Nao ha mais pessoas na sessao selecionada.');
            return;
        }

        await this.registrarChamada(proximo);
        this.dados[this.currentSection] = lista.filter((item) => item.ID !== proximo.ID);
        this.updateBadges();
        this.renderCurrentSection();
        showError(`Chamando: ${proximo.ticket}`);
    }

    async registrarChamada(registro) {
        try {
            await fetch(`${API_BASE_URL}/chamada`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket: registro.ticket,
                    horario: registro.horario || '',
                    servico: registro.servico || this.currentSection,
                }),
            });
        } catch (error) {
            console.error('Erro ao registrar chamada:', error);
        }
    }

    updateBadges() {
        Object.keys(this.dados).forEach((section) => {
            const badge = document.getElementById(`badge-${section}`);
            if (!badge) return;
            const count = this.dados[section].length;
            badge.textContent = String(count);
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

    formatarCPF(cpf) {
        if (!cpf) return '-';
        const onlyNumbers = String(cpf).replace(/\D/g, '');
        return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    tocarAlerta() {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime); // Frequência A5 (aguda p/ notificação)
            
            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05); // Suaviza o começo
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);    // Fadeout
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.3); // Dura 300ms
        } catch(e) {
            console.error('Navegador bloqueou áudio ou Web Audio API não suportada');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FilaAdmin();
});
