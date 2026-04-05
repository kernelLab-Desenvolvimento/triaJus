export function verifyCPF(cpf, cpfMessage){
    if (!cpfMessage) return false;
    
    cpfMessage.innerHTML = '';
    
    if (cpf.length === 0) return false;

    // ✅ Use variável local, não reatribua o parâmetro
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        cpfMessage.innerHTML = "";
        return false;
    }

    if (/^(\d)\1+$/.test(cpfLimpo)) {
        cpfMessage.innerHTML = '<span style="color: red;">CPF inválido</span>';
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;

    if (digit1 === parseInt(cpfLimpo.charAt(9)) && digit2 === parseInt(cpfLimpo.charAt(10))) {
        cpfMessage.innerHTML = '<span style="color: green;">CPF válido</span>';
        return true;
    } else {
        cpfMessage.innerHTML = '<span style="color: red;">CPF inválido</span>';
        return false;
    }
}
