document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const idUser = document.getElementById('idUser').value.trim();
            const setor = document.getElementById('setor').value.trim();

            if (!idUser || !setor) {
                alert('Por favor, informe o usuário e o setor.');
                return;
            }

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idUser, setor })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem('idUser', data.data.idUser);
                    localStorage.setItem('setor', data.data.setor); // Para compatibilidade do legacy
                    localStorage.setItem('setorLogado', data.data.setor);

                    // Redirecionamento condicionado
                    if (data.data.setor === 'Início de Atendimento') {
                        // Salvaremos uma flag para ocultar os botões na outra página
                        localStorage.setItem('somenteChamadaEntrada', 'true');
                        window.location.href = '/admin/02-listAt.html';
                    } else {
                        localStorage.removeItem('somenteChamadaEntrada');
                        window.location.href = '/admin/02-listAt.html';
                    }
                } else {
                    alert(data.error || 'Acesso negado. Usuário ou Setor incorretos.');
                }
            } catch (error) {
                console.error('Erro ao realizar o login:', error);
                alert('Erro de conexão ao servidor.');
            }
        });
    }
});
