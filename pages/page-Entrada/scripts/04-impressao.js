import { sequencialGen } from "../../src/ticketGen.js";
import { dataAtual, fetchAPI } from "../../scripts/config.js";
import { horaAtual } from "../../scripts/config.js";

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
            if (req && servico === 'AUDIÊNCIA') {
                displayText += `: ${req}`;
            }
            
            servicoDisplay.textContent = displayText;
        } else {
            servicoDisplay.textContent = 'Serviço não selecionado';
        }

        // Mostra/oculta horário baseado no serviço
        if (servico === 'AUDIÊNCIA' || servico === 'SERVICO_SOCIAL') {
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

        // Simula impressão/confirmação
        console.log('=== COMPROVANTE DE ATENDIMENTO ===');
        console.log('CPF:', cpfSpan.textContent);
        console.log('Serviço:', servicoDisplay.textContent);
        console.log('Horário:', horarioSection.style.display !== 'none' ? horarioSpan.textContent : 'N/A');
        console.log('Senha:', numeroSpan.textContent);
        console.log('Data:', dataSpan.textContent);
        console.log('Hora:', horaSpan.textContent);
        console.log('================================');

        // Feedback visual
        confirmarBtn.textContent = 'CONFIRMADO!';
        confirmarBtn.style.backgroundColor = '#28a745';
        confirmarBtn.disabled = true;


        const data = {
            id: numeroSequencial,
            CPF: localStorage.getItem('cpf') || '',
            ticket: numeroSequencial,
            servico: localStorage.getItem('servico') || '',
            horario: localStorage.getItem('horario') || '',
            req: localStorage.getItem('req') || ''
        };

        try {
    const endpointMap = {
        'audiencia': 'audiencia',
        'consulta': 'consulta', 
        'servicoSocial': 'servicosocial',
        'chamada': 'chamada'
    };

    const endpoint = endpointMap[data.servico];

    const resp = await fetchAPI(endpoint, 'POST', data);
    console.log('Resposta da API:', resp);
    
    // ✅ CORREÇÃO: Caminho absoluto a partir da raiz
    window.location.href = '/index.html';
    
} catch (error) {
    console.error('Erro na chamada API:', error);
    alert('Erro ao agendar. Tente novamente.');
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