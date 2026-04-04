document.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btn-inicio');
    const btnChamada = document.getElementById('btn-chamada');
    const btnEntrada = document.getElementById('btn-entrada');
    const btnEncerramento = document.getElementById('btn-encerramento');

    // Restrição caso seja logado via 'Início de Atendimento'
    if (localStorage.getItem('somenteChamadaEntrada') === 'true') {
        if (btnInicio) btnInicio.style.display = 'none';
        if (btnEncerramento) btnEncerramento.style.display = 'none';
        const cadCard = document.querySelector('.dashboard-card h2 i.bi-person-plus-fill'); // Esconde painel de cadastro se quiser
        if (cadCard) cadCard.closest('.dashboard-card').parentElement.style.display = 'none';
    }

    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            window.location.href = '/admin/03-pageAdmin.html';
        });
    }

    if (btnChamada) {
        btnChamada.addEventListener('click', () => {
            window.location.href = '/painel-de-chamada';
        });
    }

    if (btnEntrada) {
        btnEntrada.addEventListener('click', () => {
             window.location.href = '/entrada';
        });
    }

    if (btnEncerramento) {
        btnEncerramento.addEventListener('click', () => {
            window.location.href = '/admin/01-authAt.html';
        });
    }

    const formCadastroUsuario = document.getElementById('cadastro-usuario-form');
    if (formCadastroUsuario) {
        formCadastroUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('cad-nome').value;
            const cpf = document.getElementById('cad-cpf').value;
            const matricula = document.getElementById('cad-matricula').value;
            const senha = document.getElementById('cad-senha').value;
            const sudoEmail = document.getElementById('cad-sudo-email').value;
            const sudoSenha = document.getElementById('cad-sudo-senha').value;

            const setoresCheckboxes = document.querySelectorAll('.cad-setor-checkbox:checked');
            const setores = Array.from(setoresCheckboxes).map(cb => cb.value);

            if (setores.length === 0) {
                alert('Selecione ao menos um setor para o usuário.');
                return;
            }

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, cpf, matricula, senha, setores, sudoEmail, sudoSenha })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    alert(`Usuário cadastrado com sucesso!\nO ID de login gerado é: ${data.data.idUser}`);
                    formCadastroUsuario.reset();
                } else {
                    alert(data.error || 'Erro ao cadastrar usuário.');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                alert('Erro de conexão com o servidor.');
            }
        });
    }
});
