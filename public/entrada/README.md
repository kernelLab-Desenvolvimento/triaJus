# Painel de Entrada (`/public/entrada`)

Aqui reside o ponto de acesso aos guichês onde os servidores recebem as primeiras pessoas.
Diferente da interface de `admin`, que supervisiona e audita as filas/cadastros, a tela de `/entrada` destina-se unicamente para o envio formal do ticket gerado pelo Totem (`/index.html` físico) para dentro da central SQLite visando a distribuição. Módulos aqui também preparam requisições JSON simples de disparo de chamadas ou liberação de consultas.
