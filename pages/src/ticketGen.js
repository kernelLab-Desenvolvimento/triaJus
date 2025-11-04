// Gera número sequencial
export function sequencialGen(servico, horario) {
    let ticket = " ";
    const texto = servico;
    const seq = horario;
    let sequ = localStorage.getItem('seqCons')
    switch (servico) {
        case "AUDIÊNCIA":
            ticket = texto.slice(0,3) + seq.slice(0,2);
            break;
        
        case "CONSULTA":
            // Garantir que sequ seja um número, tratando null/undefined
            let numeroSequencial = parseInt(sequ) || 0;
            
            if (numeroSequencial !== 0) {
                ticket = texto.slice(0,3) + "00"+ numeroSequencial;
                localStorage.setItem('seqCons', (numeroSequencial + 1).toString());
            } else {
                localStorage.setItem('seqCons', '1');
                ticket = texto.slice(0,3) + '1';
            }
            break;
        
        case "SERVIÇO  SOCIAL":
            ticket = "SS" + seq.slice(0,2);
            break
        default:
            break;
    }
    console.log("ticket: ", ticket);
    return ticket;
}

// Atualiza data e hora atual
export function atualizarDataHora() {
    const agora = new Date();
    
    // Formata data: DD/MM/AAAA
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    
    // Formata hora: HH:MM
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return {
        'data': dataFormatada,
        'hora': horaFormatada
    };
}