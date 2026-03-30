document.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btn-inicio');
    const btnEncerramento = document.getElementById('btn-encerramento');

    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            window.location.href = '/admin/03-pageAdmin.html';
        });
    }

    if (btnEncerramento) {
        btnEncerramento.addEventListener('click', () => {
            localStorage.removeItem('section');
            window.location.href = '/entrada';
        });
    }
});
