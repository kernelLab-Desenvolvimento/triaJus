// ../page-Entrada/scripts/01-auth.js
/*imports*/
import { verifyCPF } from "../../src/cpfVerify.js";

export function auth() {
    // Elementos DOM
    const cpfInput = document.getElementById('cpfInput');
    const cpfForm = document.getElementById('cpfForm');
    const cpfMessage = document.getElementById('cpfMessage');

    // Formatação do CPF enquanto digita
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            // Formatação: XXX.XXX.XXX-XX
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            e.target.value = value;
        }
        
        // Verificação em tempo real
        verifyCPF(value.replace(/\D/g, ''));
    });

    // Submissão do formulário
    cpfForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = cpfInput.value.replace(/\D/g, '');
        
        if (cpf.length === 11 && verifyCPF(cpf)) {
            localStorage.setItem('cpf', cpf.toString());
            
            if (cpfMessage) {
                console.log("cpf armazenado");
                console.log(localStorage.getItem('cpf'));
            }
            
            // Redireciona após 1 segundo
            setTimeout(() => {
                window.location.href = './02-service.html';
            }, 1000);
        } else {
            if (cpfMessage) {
                cpfMessage.innerHTML = '<span style="color: red;">Por favor, insira um CPF válido</span>';
            }
        }
    });


}