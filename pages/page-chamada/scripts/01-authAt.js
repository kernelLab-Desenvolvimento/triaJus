export function authAt() {
    const buttons = document.querySelectorAll('.btn button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe 'selected' de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = ''; // Remove cor de fundo se houver
                btn.style.color = ''; // Remove cor do texto
            });
            
            // Adiciona a classe 'selected' ao botão clicado
            this.classList.add('selected');
            this.style.backgroundColor = '#405e7eff';
            this.style.color = 'white';
            
            // Obtém o texto do botão
            const servico = this.getAttribute('data-servico');
            
            // Armazena no localStorage
            localStorage.setItem('section', servico);
            console.log('Serviço no localStorage:', localStorage.getItem('section'));
            
            // Redireciona após um breve delay
            setTimeout(() => {
                window.location.href = './02-list.html'; // Corrigido: 'swindow' e caminho
            }, 500);
        });
    });
}