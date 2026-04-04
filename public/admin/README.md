# Painel de Administração (`/public/admin`)

Esta camada front-end encapsula a interface do sistema voltada aos funcionários e supervisores do ecossistema TriaJus. 

Para que as informações trafeguem em segurança, os domínios destas páginas (`authAt.html`, `listAt.html` e `pageAdmin.html`) são atrelados fortemente ao `localStorage` para assegurar que um usuário não intercepte os blocos errados que não estejam correlacionados com a aprovação setorial do seu cargo (e.g., Serviço Social, Audiência, Consulta). A página de login é projetada sob heurísticas modernas utilizando Glassmorphism e restrições.

### Interface em Destaque:
- **authAt.html**: Página dedicada ao fechamento de expediente, que pede autorização por credencial especial **"Sudo"** para rodar o trancamento e varredura do SQLite.
- **listAt.html**: Fator de entrada principal e Dashboard de comandos centrais, também hospedando blocos dinâmicos geradores de novos usuários multi-setores.
- **pageAdmin.html**: Telas de tabelas para enxergar em tempo real a listagem populacional, podendo chamar proativos usando WebSockets caso passe pelas engrenagens de permissão do navegador e JavaScript.
