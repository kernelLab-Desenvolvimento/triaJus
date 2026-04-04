# Painel do Chamador (`/public/chamada`)

Este diretório contém o front-end projetado para rodar autônomo nas TVs e painéis do saguão do Fórum.
Ao ouvir eventos despachados no Socket na porta :8080 (se configurado padrão), ele renderiza e manipula o visual das numerações e dos nomes. Não existem botões de operação direta aqui, pois este age estritamente como um **Consumidor Passivo (Visualizador)** que pisca as prioridades processadas por outras alas do Fórum.
