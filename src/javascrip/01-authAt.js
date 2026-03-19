
export function authAt() {
    // Seleciona todos os botões dentro das divs de classe btn-1, btn-2, etc.
    const buttons = document.querySelectorAll('.btn button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe 'selected' e limpa estilos de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = ''; 
                btn.style.color = ''; 
            });
            
            // Adiciona a classe 'selected' e estilo ao botão clicado
            this.classList.add('selected');
            this.style.backgroundColor = '#405e7eff';
            this.style.color = 'white';
            
            // Obtém o valor do atributo 'data-servico'
            const servico = this.getAttribute('data-servico');
            
            if (servico) {
                // Armazena no localStorage
                localStorage.setItem('section', servico);
                console.log('Serviço salvo:', servico);
                
                // Redireciona após 500ms
                setTimeout(() => {
                    window.location.href = '/pages/page-chamada/html/02-list.html';
                }, 500);
            }
        });
    });
}

// Executa a função ao carregar o script
authAt();