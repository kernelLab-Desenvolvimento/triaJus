# Gerenciador de Sockets (`/config/websocket`)

O protocolo HTTP emula uma chamada "request-response" que forçaria a TV do Fórum a dar refresh na página pra saber se alguém foi chamado. Para evitar isso e usar comunicações bidirecionais permanentes abrimos o Websocket (`ws`).

Essa camada garante o pareamento no lado do servidor, captando seções (`type: 'audiência'`, etc) enviadas pelo client de Administração emitindo em paralelo (Broadcast nativo) o gatilho para atualizar qualquer tela de quem escuta porta `8080` ao som de bipe na mesma fração de segundo.
