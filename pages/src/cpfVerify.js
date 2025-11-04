export function verifyCPF(cpf){
    if (!cpfMessage) return false;
    
    cpfMessage.innerHTML = '';
    
    if (cpf.length === 0) {
        return false;
    }

    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        cpfMessage.innerHTML = "";
        return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        cpfMessage.innerHTML = '<span style="color: red;">CPF inválido</span>';
        return false;
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;

    // Verifica se os dígitos calculados conferem com os informados
    if (digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10))) {
        cpfMessage.innerHTML = '<span style="color: green;">CPF válido</span>';
        return true;
    } else {
        cpfMessage.innerHTML = '<span style="color: red;">CPF inválido</span>';
        return false;
    }
}