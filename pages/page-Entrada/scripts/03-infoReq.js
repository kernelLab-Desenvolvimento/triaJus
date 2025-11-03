export function infoReq() {
    // Elementos dos horários
    const horarioButtons = document.querySelectorAll('.btn-T4 button');
    // Elementos das opções (checkboxes)
    const checkboxes = document.querySelectorAll('.op input[type="checkbox"]');
    // Botão de confirmação
    const confirmButton = document.querySelector('.btn-op');
    
    let horarioSelecionado = null;
    let opcaoSelecionada = null;

    // Seleção de horários (apenas um)
    horarioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove seleção de todos os horários
            horarioButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
            
            // Adiciona seleção ao horário clicado
            this.classList.add('selected');
            this.style.backgroundColor = '#1f3449ff';
            this.style.color = 'white';
            
            // Obtém o TÍTULO do botão em vez do texto
            horarioSelecionado = this.getAttribute('title');
            console.log('Horário selecionado:', horarioSelecionado);
            
            // Atualiza o botão de confirmação
            updateConfirmButton();
        });
    });

    // Seleção de opções (apenas uma)
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const opcao = this.closest('div').querySelector('li').textContent.trim();
            
            if (this.checked) {
                // Se já existe uma opção selecionada, desseleciona a anterior
                if (opcaoSelecionada && opcaoSelecionada !== opcao) {
                    // Encontra e desseleciona o checkbox anterior
                    checkboxes.forEach(cb => {
                        const opcaoAnterior = cb.closest('div').querySelector('li').textContent.trim();
                        if (opcaoAnterior === opcaoSelecionada) {
                            cb.checked = false;
                            // Remove estilo visual do anterior
                            cb.closest('div').style.backgroundColor = '';
                            cb.closest('div').style.borderColor = '';
                        }
                    });
                }
                
                // Define a nova opção selecionada
                opcaoSelecionada = opcao;
                
                // Adiciona estilo visual ao selecionado
                this.closest('div').style.backgroundColor = '#e8f4fd';
                this.closest('div').style.borderColor = '#1f3449ff';
                
            } else {
                // Se está desselecionando, limpa a opção selecionada
                opcaoSelecionada = null;
                // Remove estilo visual
                this.closest('div').style.backgroundColor = '';
                this.closest('div').style.borderColor = '';
            }
            
            console.log('Opção selecionada:', opcaoSelecionada);
            updateConfirmButton();
        });
    });

    // Função para atualizar o estado do botão de confirmação
    function updateConfirmButton() {
        if (horarioSelecionado && opcaoSelecionada) {
            confirmButton.disabled = false;
            confirmButton.style.backgroundColor = '#28a745';
            confirmButton.style.cursor = 'pointer';
        } else {
            confirmButton.disabled = true;
            confirmButton.style.backgroundColor = '#6c757d';
            confirmButton.style.cursor = 'not-allowed';
        }
    }

    // Confirmação final
    confirmButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!horarioSelecionado || !opcaoSelecionada) {
            alert('Por favor, selecione um horário e uma opção antes de confirmar.');
            return;
        }
        
        // Armazena os dados no localStorage
        localStorage.setItem('horario', horarioSelecionado);
        localStorage.setItem('req', opcaoSelecionada); // Agora armazena apenas uma string
        
        console.log('Dados armazenados:');
        console.log('Horário:', localStorage.getItem('horario'));
        console.log('Opção:', localStorage.getItem('req'));
        
        // Feedback visual
        this.textContent = 'CONFIRMADO!';
        this.style.backgroundColor = '#218838';
        
        // Redireciona para próxima página
        setTimeout(() => {
            window.location.href = './04-resumo.html';
        }, 1500);
    });

    // Estilos iniciais
    confirmButton.disabled = true;
    confirmButton.style.backgroundColor = '#6c757d';
    confirmButton.style.cursor = 'not-allowed';
    

}