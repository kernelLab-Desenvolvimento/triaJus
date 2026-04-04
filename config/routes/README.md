# API Endpoints e Rotas Express (`/config/routes`)

Estes são os nervos centrais do Express.

- **`apirouter.js`**: Disponibiliza as URLs que sofrem Fetch dos navegadores voltados inteiramente as integrações operacionais, tais como registrar o tickete, emitir um paciente para chamada, ou ainda (em casos de Super Usuários logados), o POST para a rota sensível `/api/wipe` que emite o comando destrutivo limpando o log dinâmico do `database.sqlite`.
- **`authrouter.js`**: Camada que lida contra senhas, id, restrições e registros. Ao invés do `server.js` tratar auth cru, as lógicas de varredura das colunas no `dbUsers` (Checar a "SudoKey" ou atrelar múltiplos check-boxes de setor ao ID recém criado) ficam contidas estritamente nas rotas desta engrenagem.
- **`usersrouter.js`**: Uma forma simplificada e puramente conceitual de gerir `res.sendFile()`, escondendo as extensões `.html` na hora de servir o index, entrada e demais telas do `public/`.
