# RP-JTS

## **1. Rodando o projeto**

### Instalações

```bash
npm install express
npm install cors
npm install postgres

## Server
node beckend/server.js
```

## **2. Padrões de projeto**

Todos os padrões utilizados nesse projeto.

###   2.1 Banco de dados
Model para os bancos de dados para cada serviço
```bash
| Audiência          | Consultas         | Serviço Social    |
|--------------------|-------------------|-------------------|
| nome:              | nome:             | nome:             |
| cpf:               | cpf:              | cpf:              |
| servico:           | ordem:            | servico:          |
| horario:           | data:             | horario:          |
| req:               |                   | data:             |
| data:              |                   |                   |
```

###   2.2 Estrutura do projeto
```markdown
chamaJus/
├── backend
│   ├── crud.js
│   ├── models.js
│   ├── registros.db
│   ├── server.js
│   └── teste
├── pages
│   ├── css
│   │   ├── drop.css
│   │   ├── gerador.css
│   │   ├── geral.css
│   │   ├── index.css
│   │   ├── tela-07.css
│   │   └── tela-08.css
│   ├── IMG
│   │   ├── branca.png
│   │   ├── can tuc.png
│   │   ├── fablab.png
│   │   └── teste 01.png
│   ├── pageChamada
│   │   ├── html
│   │   │   └── telaChamada.html
│   │   └── scripts
│   │       └── telaChamada.js
│   ├── pageEntrada
│   │   ├── html
│   │   │   ├── 01-autenticacao.html
│   │   │   ├── 02-servico.html
│   │   │   ├── 03-seletorHorario.html
│   │   │   ├── 04-impressao.html
│   │   │   └── prioridade.html
│   │   └── scripts
│   │       ├── 01-autenticacao.js
│   │       ├── 02-servico.js
│   │       ├── 03-seletorHorario.js
│   │       └── 04-impressao.js
│   ├── pageOp
│   │   ├── html
│   │   │   └── operacao.html
│   │   └── scripts
│   │       └── operacao.js
│   └── scripts
│       ├── config.js
│       ├── main.js
│       └── service.js
├── index.html

```


### Pagina de operação
a inserir

## 3. Próximos passos
### V1.0
  - Fluxo simples de inicio de atendimento
  - Pagina unica para todos os terminais
  - Modelo simplificado de pagina de chamada
  - Audio personalizado de chamada


