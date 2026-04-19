import { API_BASE_URL, showError } from '/src/javascrip/config.js';

class FilaAdmin {
    constructor() {
        this.currentSection = 'audiencia';
        this.currentLabel = 'AUDIÊNCIA';
        this.sessaoSelecionada = '08:00';
        this.viewMode = 'aguardando';
        this.dados = {
            audiencia: [],
            consulta: [],
            servicoSocial: [],
            chamada: [],
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
        
        this.btnAguardando = document.getElementById('btn-view-aguardando');
        this.btnChamados = document.getElementById('btn-view-chamados');
        this.containerCpf = document.getElementById('container-cpf-manual');
        this.selectCpf = document.getElementById('select-cpf-manual');
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

        if (this.btnAguardando && this.btnChamados) {
            this.btnAguardando.addEventListener('click', () => this.setViewMode('aguardando'));
            this.btnChamados.addEventListener('click', () => this.setViewMode('chamados'));
        }
    }

    setViewMode(mode) {
        this.viewMode = mode;
        if (this.btnAguardando && this.btnChamados) {
            this.btnAguardando.classList.toggle('active', mode === 'aguardando');
            this.btnChamados.classList.toggle('active', mode === 'chamados');
        }
        
        this.btnChamar.style.display = mode === 'chamados' ? 'none' : 'block';
        if (this.containerCpf) {
            this.containerCpf.style.display = (mode === 'aguardando' && this.currentSection === 'servicoSocial') ? 'flex' : 'none';
        }

        this.renderCurrentSection();
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
        
        if (this.containerCpf) {
            this.containerCpf.style.display = (section === 'servicoSocial' && this.viewMode === 'aguardando') ? 'flex' : 'none';
        }

        this.atualizarCabecalhoTabela();
        this.renderCurrentSection();
    }

    async loadAllData() {
        await Promise.allSettled([
            this.loadSectionData('audiencia'),
            this.loadSectionData('consulta'),
            this.loadSectionData('servicoSocial'),
            this.loadSectionData('chamada'),
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
            ['audiencia', 'consulta', 'servicoSocial', 'chamada'].forEach((section) => {
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
        let lista = this.dados[this.currentSection] || [];
        const chamadas = this.dados.chamada || [];
        
        let cruzados = [];
        if (this.currentSection === 'audiencia') {
            cruzados = lista.filter(item => {
                const isChamado = chamadas.some(c => c.horario === item.horario && c.servico === 'audiencia');
                return this.viewMode === 'chamados' ? isChamado : !isChamado;
            });
        } else {
            cruzados = lista.filter(item => {
                const isChamado = chamadas.some(c => c.ticket === item.ticket && c.servico === this.currentSection);
                return this.viewMode === 'chamados' ? isChamado : !isChamado;
            });
        }

        const isConsulta = this.currentSection === 'consulta';
        const isAudiencia = this.currentSection === 'audiencia';
        const filtrados = isConsulta
            ? cruzados
            : cruzados.filter((item) => item.horario === this.sessaoSelecionada);

        if (this.currentSection === 'servicoSocial' && this.selectCpf && this.viewMode === 'aguardando') {
            this.selectCpf.innerHTML = '<option value="">(Chamar Próximo da Fila)</option>';
            filtrados.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.CPF;
                opt.textContent = this.formatarCPF(item.CPF);
                this.selectCpf.appendChild(opt);
            });
        }

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
        if (this.viewMode === 'chamados') return;
        
        let lista = this.dados[this.currentSection] || [];
        const chamadas = this.dados.chamada || [];
        
        let aguardando = [];
        if (this.currentSection === 'audiencia') {
            aguardando = lista.filter(item => !chamadas.some(c => c.horario === item.horario && c.servico === 'audiencia'));
        } else {
            aguardando = lista.filter(item => !chamadas.some(c => c.ticket === item.ticket && c.servico === this.currentSection));
        }

        const isConsulta = this.currentSection === 'consulta';
        const filtrados = isConsulta
            ? aguardando
            : aguardando.filter((item) => item.horario === this.sessaoSelecionada);

        if (!filtrados.length) {
            showError('Nao ha mais pessoas aguardando nesta sessao.');
            return;
        }

        let proximo = filtrados[0];

        if (this.currentSection === 'servicoSocial' && this.selectCpf && this.selectCpf.value) {
            const selecionado = filtrados.find(item => item.CPF === this.selectCpf.value);
            if (selecionado) proximo = selecionado;
        }

        await this.registrarChamada(proximo);
        
        this.dados.chamada.push({
            ticket: proximo.ticket,
            horario: proximo.horario || '',
            servico: this.currentSection
        });
        
        this.updateBadges();
        this.renderCurrentSection();
        showError(`Chamando: ${proximo.ticket || 'Sessão ' + proximo.horario}`);
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
        const chamadas = this.dados.chamada || [];
        Object.keys(this.dados).forEach((section) => {
            if (section === 'chamada') return;
            const badge = document.getElementById(`badge-${section}`);
            if (!badge) return;
            
            const lista = this.dados[section] || [];
            let aguardando = 0;
            
            if (section === 'audiencia') {
                aguardando = lista.filter(item => !chamadas.some(c => c.horario === item.horario && c.servico === 'audiencia')).length;
            } else {
                aguardando = lista.filter(item => !chamadas.some(c => c.ticket === item.ticket && c.servico === section)).length;
            }
            
            badge.textContent = String(aguardando);
            badge.style.display = aguardando > 0 ? 'inline-flex' : 'none';
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
