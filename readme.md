# 🚀 TriaJus

<div align="center">
  
  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
  ![License](https://img.shields.io/badge/license-MIT-green.svg)
  ![Node](https://img.shields.io/badge/node-18.x-brightgreen.svg)
  ![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-blue.svg)
  ![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
  
  <h3>Sistema de autoatendimento e gerenciamento de filas voltado para o Poder Judiciário</h3>
  
</div>

---

## 📑 Sumário

- Sobre o Projeto
- Tecnologias
- Pré-requisitos
- Instalação
- Configuração
- Execução
- Estrutura do Projeto
- API Endpoints
- Contribuição
- Licença
- Autores

---

## 🎯 Sobre o Projeto

O **TriaJus** é uma plataforma desenvolvida para gerenciar o fluxo de atendimento em Fóruns do Poder Judiciário. O projeto visa modernizar e organizar a recepção do cidadão através de um totem interativo de triagem e um painel de chamadas automatizado.

- **Problema que resolve**: Desorganização em filas de espera e falta de direcionamento claro para serviços judiciários específicos (Audiências, Consultas de Processo e Serviço Social).
- **Público-alvo**: Cidadãos, Advogados e Servidores do Poder Judiciário.
- **Principais funcionalidades**: Autoatendimento para emissão de tickets, triagem guiada de serviços por horário, sincronização de painel via WebSocket e impressão de comprovantes otimizados.

### ✨ Funcionalidades Principais

- ✅ Totem de autoatendimento com identificação por CPF.
- ✅ Triagem condicional (ex: escolha de horários restritos para audiências).
- ✅ Geração inteligente de senhas alfanuméricas sequenciais (ex: `AUD10`, `CON001`).
- ✅ Painel do chamador em tempo real atualizado via WebSockets.
- ✅ Comprovante de atendimento preparado para impressão térmica.

---

## 🛠 Tecnologias

### Frontend
- **HTML5 & CSS3** - Estrutura e estilização responsiva/para impressão.
- **JavaScript (Vanilla)** - ES Modules para lógica de telas, persistência via `localStorage`.
- **Fetch API** - Consumo da API REST.
- **WebSocket Client** - Conexão em tempo real para o painel chamador.

### Backend
- **Node.js** - Ambiente de execução central.
- **Express** - Servidor web e rotas da API.
- **ws** - Servidor de WebSockets integrado para mensageria instantânea.
- **[SQLite / PostgreSQL]** - Persistência e logs (configurado via dependências).

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado na máquina servidora:

- **Node.js** (versão 18.x ou superior recomendada)
- **npm** (versão 9.x) ou **yarn**
- **Git**

```bash
# Verifique suas versões
node --version   # v18.12.0+
npm --version    # 9.0.0+
git --version    # 2.40.0+
```

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/lucasitron/triaJus-eduardo.git
cd triaJus-eduardo

# Instale as dependências unificadas do projeto
npm install
```

---

## ⚙ Configuração

O sistema foi desenvolvido para descobrir a interface de rede local automaticamente. No entanto, se precisar apontar o frontend para um servidor remoto, edite os arquivos de configuração do cliente.

#### Frontend (`src/javascrip/config.js`)
```javascript
// Exemplo de configuração manual caso o backend esteja em outro host
export const API_BASE_URL = `http://192.168.0.10:3001/api`;
export const WEBSOCKET_URL = `ws://192.168.0.10:8080`;
```

#### Backend (`server.js`)
O servidor Express é executado por padrão na porta **3001** e o servidor WebSocket opera na porta **8080**.

---

## 🚀 Execução

O TriaJus serve o frontend de forma estática junto com a API REST, dispensando a necessidade de iniciar o frontend separadamente em produção.

```bash
# Na raiz do projeto, inicie o servidor:
node server.js
```

**Acesse através dos links fornecidos no console:**
- 🖥️ **Tela de Cadastro (Totem):** http://localhost:3001
- ⚙️ **Tela de Operação:** http://localhost:3001/entrada
- 📺 **Painel de Chamadas:** http://localhost:3001/painel-de-chamada

*(O terminal também exibirá o IP da rede local para acessos de outras máquinas/totens)*

---

## 📁 Estrutura do Projeto

```
📦 triaJus
├── 📂 config/                          # Configurações do Backend
│   ├── 📂 routes/                       # Rotas da API e Navegação (usersrouter.js, apirouter.js)
│   ├── 📂 services/                     # Lógicas de negócio (ticketGen.js)
│   └── 📂 websocket/                    # Configuração e Handlers WS
│
├── 📂 public/                          # Arquivos Públicos
│   ├── 📄 chamador.html                 # Painel da TV
│   └── 📄 entrada.html                  # Painel Operacional
│
├── 📂 src/                             # Aplicação Frontend
│   ├── 📂 css/                          # Estilizações modulares
│   │   ├── 📄 gerador.css
│   │   ├── 📄 tela-08.css
│   │   └── 📄 04-impressao.css
│   ├── 📂 javascrip/                    # Lógica de interface
│   │   ├── 📄 02-service.js
│   │   ├── 📄 03-infoReq.js             # Validação de horários
│   │   ├── 📄 04-impressao.js           # Finaliza ticket e imprime
│   │   └── 📄 config.js                 # Variáveis globais de ambiente
│   └── 📄 index.html                    # Tela inicial do Totem
│
├── 📄 server.js                        # Ponto de entrada Node.js
├── 📄 package.json                     # Dependências do projeto
└── 📄 README.md                        # Documentação principal
```

---

## 🌐 API Endpoints

O backend disponibiliza uma API REST para registro de novas senhas geradas pelo Totem. 

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/audiencia` | Registra senha para Audiência |
| POST | `/api/consulta` | Registra senha para Consulta |
| POST | `/api/servicosocial` | Registra senha para Serv. Social |

### Fluxo de Dados (Frontend)
Durante o uso no Totem, a aplicação utiliza o `localStorage` para transitar dados do cidadão entre as telas:
- `cpf`: Coletado na tela inicial.
- `servico`: Categoria escolhida ('audiencia', 'consulta', etc).
- `horario`: Horário ou sessão de destino selecionada.
- `req`: Requisitos específicos da sessão.

### Mensageria WebSocket
Eventos emitidos pelo painel operacional (`/entrada`) são repassados ao servidor na porta `8080`, que realiza o *broadcast* imediato para o(s) painel(éis) de chamada (`/painel-de-chamada`), acionando recursos visuais e sonoros na TV.

---



## 👥 Autores

- **Lucas Gonçalves** - *Desenvolvimento* - @lucasitron
- **Eduardo** - *Colaborador*
- **KLH - Desenvolvimento** - *Organização*

---

## 📞 Contato

- **LinkedIn**: Lucas Gonçalves
- **GitHub**: @lucasitron

---

<div align="center">
  <sub>Feito com ❤️ pela equipe TriaJus</sub>
</div>