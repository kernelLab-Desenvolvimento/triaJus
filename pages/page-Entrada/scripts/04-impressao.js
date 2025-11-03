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
    const userCPF = localStorage.getItem('userCPF');

    // Gera número sequencial
    const numeroSequencial = gerarNumeroSequencial();

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
            const servicoTexto = converterServicoParaTexto(servico);
            let displayText = servicoTexto;
            
            // Adiciona req se existir (apenas para audiência)
            if (req && servico === 'AUDIENCIA') {
                displayText += `: ${req}`;
            }
            
            servicoDisplay.textContent = displayText;
        } else {
            servicoDisplay.textContent = 'Serviço não selecionado';
        }

        // Mostra/oculta horário baseado no serviço
        if (horario && (servico === 'AUDIENCIA' || servico === 'SERVICO_SOCIAL')) {
            horarioSpan.textContent = horario;
            horarioSection.style.display = 'block';
        } else {
            horarioSection.style.display = 'none';
        }

        // Atualiza número sequencial
        numeroSpan.textContent = numeroSequencial.toString().padStart(3, '0');

        // Atualiza data e hora atual
        atualizarDataHora();
    }

    // Formata CPF
    function formatarCPF(cpf) {
        const cpfString = cpf.toString().padStart(11, '0');
        return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Converte serviço para texto amigável
    function converterServicoParaTexto(servico) {
        const servicos = {
            'AUDIENCIA': 'AUDIÊNCIA',
            'CONSULTA_PROCESSOS': 'CONSULTA',
            'SERVICO_SOCIAL': 'SERVIÇO SOCIAL'
        };
        return servicos[servico] || servico;
    }

    // Gera número sequencial
    function gerarNumeroSequencial() {
        let ultimoNumero = parseInt(localStorage.getItem('ultimoNumero')) || 0;
        ultimoNumero = (ultimoNumero % 999) + 1;
        localStorage.setItem('ultimoNumero', ultimoNumero.toString());
        return ultimoNumero;
    }

    // Atualiza data e hora atual
    function atualizarDataHora() {
        const agora = new Date();
        
        // Formata data: DD/MM/AAAA
        const dia = agora.getDate().toString().padStart(2, '0');
        const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
        const ano = agora.getFullYear();
        dataSpan.textContent = `${dia}/${mes}/${ano}`;
        
        // Formata hora: HH:MM
        const horas = agora.getHours().toString().padStart(2, '0');
        const minutos = agora.getMinutes().toString().padStart(2, '0');
        horaSpan.textContent = `${horas}:${minutos}`;
    }

    // Função para confirmar e tocar áudio
    function confirmarAtendimento() {
        // Toca o áudio
        if (audio) {
            audio.play().catch(error => {
                console.log('Erro ao reproduzir áudio:', error);
            });
        }

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

        // Redireciona para página inicial após 3 segundos
        setTimeout(() => {
            window.location.href = '../../../index.html';
        }, 3000);
    }

    // Event listeners
    confirmarBtn.addEventListener('click', confirmarAtendimento);

    // Atualiza data e hora a cada minuto
    setInterval(atualizarDataHora, 60000);

    // Inicialização
    atualizarInterface();

    // Verifica se há dados básicos
    if (!servico || !userCPF) {
        console.warn('Dados insuficientes para gerar comprovante');
        servicoDisplay.textContent = 'Dados insuficientes';
        confirmarBtn.disabled = true;
    }
}