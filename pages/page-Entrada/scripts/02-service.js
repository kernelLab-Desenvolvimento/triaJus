export function service() {
    const buttons = document.querySelectorAll('.btn button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe 'selected' de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = ''; // Remove cor de fundo se houver
            });
            
            // Adiciona a classe 'selected' ao botão clicado
            this.classList.add('selected');
            this.style.backgroundColor = '#007bff'; // Ou a cor que preferir
            this.style.color = 'white';
            
            // Obtém o texto do botão (ou pode usar o title do div pai)
            const servico = this.textContent.trim();
            const servicoValue = servico.replace('<br>', ' '); // Remove quebras de linha
            
            // Armazena no localStorage
            localStorage.setItem('servico', servicoValue);
            console.log('Serviço selecionado:', servicoValue);
            console.log('Serviço no localStorage:', localStorage.getItem('servico'));
            
            // Redireciona após um breve delay
            setTimeout(() => {
                window.location.href = './03-infoReq.html';
            }, 800);
        });
    });
    

}