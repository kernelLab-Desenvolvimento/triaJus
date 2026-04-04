# Infraestrutura de Banco de Dados (`/config/database`)

Esta pasta isola a persistência da aplicação local na ausência de instâncias externas de PostgreSQL e congêneres.

- **`database.js` / `database.sqlite`**: Armazena e roteia as submissões de formulário do cidadão. Ele gerencia as filas reais mantendo os registros diários (Tabelas de `audiência`, `consulta`, etc) aptos para relatórios.
- **`dbUsers.js` / `dbUsers.sqlite`**: A fortaleza da aplicação. Aqui o script Node cria e popula uma matriz relacional que mapeia as contas Sudo (Administrador/Dev Root), chaves do `idUser` dos servidores e correlaciona a liberação com a tabela `setores`. Scripts atuam como "Migration" natural na inicialização do serviço, garantindo que o módulo operante e global `Dev` com senha `Dev` exista inerentemente.
