document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.href = '/admin/02-listAt.html';
    });
});
