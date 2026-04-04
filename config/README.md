# Config (`/config`)

Este diretório funciona como a camada central do back-end (Backbone) do núcleo da nossa aplicação Express.js.

## Subdiretórios:
- **`/database/`**: Armazena e inicializa as conexões e os arquivos `.sqlite` que mantêm os estados da nossa aplicação. Possui a base de dados dos tickets transacionais e uma base estrutural blindada separada para `users`, `login` e `setores` configurando as credenciais dos seus operadores.
- **`/routes/`**: Centraliza os controladores REST API, separando `usersrouter.js` (redirecionadores das páginas HTML principais), `apirouter.js` (manipula os endpoints de CRUDS de emissão de fila e controle Sudo Wipe) e `authrouter.js` (Lógica de logins condicionais e registros por setor).
- **`/websocket/`**: O motor responsável pelo envio sem interrupção de novas requisições em tempo real da mesa de triagem diretamente para a TV.
- **`/services/` e `/middleware/`**: Manipulam blocos de processamento autônomos (geração de senhas unificadas) ou autorizações protetoras da requisição em trânsito.
