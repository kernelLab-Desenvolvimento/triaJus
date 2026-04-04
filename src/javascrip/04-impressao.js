import { sequencialGen } from "/config/services/ticketGen.js";
import { dataAtual, fetchAPI } from "/src/javascrip/config.js";
import { horaAtual } from "/src/javascrip/config.js";

export function impressao() {
    // Elementos da página
    const cpfSpan = document.getElementById('cpf');
    const servicoDisplay = document.getElementById('servicoDisplay');
    const horarioSpan = document.getElementById('horario');
    const horarioSection = document.getElementById('horarioSection');
    const numeroSpan = document.getElementById('numeroSequencial');
    const dataSpan = document.getElementById('data');
    const horaSpan = document.getElementById('hora');
    const confirmarBtn = document.getElementById('btn_gerador');
    const audio = document.getElementById('audioClique');

    // Recupera dados do localStorage
    const servico = localStorage.getItem('servico');
    const horario = localStorage.getItem('horario');
    const req = localStorage.getItem('req');
    const userCPF = localStorage.getItem('cpf');

    // Gera número sequencial
    const numeroSequencial = sequencialGen(servico, horario);

    // Atualiza a interface com os dados
    function atualizarInterface() {
        // Formata CPF
        if (userCPF) {
            const cpfFormatado = formatarCPF(userCPF);
            cpfSpan.textContent = cpfFormatado;
        } else {
            cpfSpan.textContent = 'CPF não informado';
        }

        // Atualiza serviço com req se existir
        if (servico) {
            let displayText = servico;
            
            // Adiciona req se existir (apenas para audiência)
            if (req && servico === 'audiencia') {
                displayText += `: ${req}`;
            }
            
            servicoDisplay.textContent = displayText;
        } else {
            servicoDisplay.textContent = 'Serviço não selecionado';
        }

        // Mostra/oculta horário baseado no serviço
        if (servico === 'audiencia' || servico === 'servicoSocial') {
            horarioSpan.textContent = horario;
            horarioSection.style.display = 'block';
        } else {
            horarioSection.style.display = 'none';
        }

        // Atualiza número sequencial
        numeroSpan.textContent = numeroSequencial.toString().padStart(3, '0');

        // Atualiza data e hora atual
        dataSpan.textContent = dataAtual();
        horaSpan.textContent = horaAtual();
    }

    // Formata CPF
    function formatarCPF(cpf) {
        const cpfString = cpf.toString().padStart(11, '0');
        return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Função para confirmar e tocar áudio
    async function confirmarAtendimento() {
    confirmarBtn.textContent = 'CONFIRMADO!';
    confirmarBtn.style.backgroundColor = '#28a745';
    confirmarBtn.disabled = true;

    const servicoAtual = localStorage.getItem('servico') || '';

    const data = {
        CPF: localStorage.getItem('cpf') || '',
        ticket: numeroSequencial,
        servico: servicoAtual,
        horario: localStorage.getItem('horario') || '',
        req: localStorage.getItem('req') || ''
    };

    // ✅ Log para depuração — veja no console qual valor chega
    console.log('Dados para envio:', data);

    const endpointMap = {
        'audiencia':     'audiencia',
        'consulta':      'consulta',
        'servicoSocial': 'servicosocial',
    };

    const endpoint = endpointMap[servicoAtual];

    // ✅ Garante que o endpoint existe antes de chamar a API
    if (!endpoint) {
        console.error('Serviço inválido ou não mapeado:', servicoAtual);
        alert(`Serviço inválido: "${servicoAtual}". Volte e selecione novamente.`);
        confirmarBtn.disabled = false;
        confirmarBtn.textContent = 'CONFIRMAR';
        return;
    }

    try {
        const resp = await fetchAPI(endpoint, 'POST', data);
        console.log('Resposta da API:', resp);
        window.location.href = '/entrada';
    } catch (error) {
        console.error('Erro na chamada API:', error);
        alert(`Erro ao agendar: ${error.message}`);
        confirmarBtn.disabled = false;
        confirmarBtn.textContent = 'CONFIRMAR';
    }
}
    // Event listeners
    confirmarBtn.addEventListener('click', confirmarAtendimento);
    
    // Inicialização
    atualizarInterface();

    // Verifica se há dados básicos
    if (!servico || !userCPF) {
        console.warn('Dados insuficientes para gerar comprovante');
        servicoDisplay.textContent = 'Dados insuficientes';
        confirmarBtn.disabled = true;
    }
}