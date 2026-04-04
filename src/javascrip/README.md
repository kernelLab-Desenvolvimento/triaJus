# Scripts Core (`/src/javascrip`)

Base central dos comportamentos do front-end interagindo com a visualização do usuário. 
Scripts na raiz desta pasta controlam funções como o `login.js` (redirecionamentos condicionados usando `localStorage`), envios de Fetch Api básicos (`config.js`) ou lógicas de geração de filas isoladas. 

Os subdiretórios dividem os níveis de acesso:
- **`admin/`**: Contém arquivos restritos e logicamente bloqueados usando verificações RBAC e Notificações (ex: `03-pageAdmin.js`).
