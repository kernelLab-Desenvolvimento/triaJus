import { verifyCPF } from "/config/services/cpfVerify.js";

export function auth() {
    const cpfInput = document.getElementById('cpfInput');
    const cpfForm = document.getElementById('cpfForm');
    const cpfMessage = document.getElementById('cpfMessage');

    // ✅ Verifica se os elementos existem antes de usar
    if (!cpfInput || !cpfForm || !cpfMessage) {
        console.warn('Elementos do formulário não encontrados');
        return;
    }

    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            e.target.value = value;
        }
        
        verifyCPF(value.replace(/\D/g, ''), cpfMessage);
    });

    cpfForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = cpfInput.value.replace(/\D/g, '');
        
        if (cpf.length === 11 && verifyCPF(cpf, cpfMessage)) {
            localStorage.setItem('cpf', cpf.toString());
            console.log("cpf armazenado:", localStorage.getItem('cpf'));
            
            setTimeout(() => {
                window.location.href = '/entrada/02-service.html';
            }, 1000);
        } else {
            cpfMessage.innerHTML = '<span style="color: red;">Por favor, insira um CPF válido</span>';
        }
    });
}

