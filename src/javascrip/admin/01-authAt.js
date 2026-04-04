document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        fetch('/api/wipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Banco de dados zerado e atendimento encerrado com sucesso.');
                localStorage.removeItem('section');
                window.location.href = '/';
            } else {
                alert(data.error || 'Credenciais inválidas.');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro de conexão ao servidor.');
        });
    });
});
