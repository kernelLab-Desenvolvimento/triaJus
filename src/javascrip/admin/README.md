# Controle de Ameaças e Permissões Administrativas (`/src/javascrip/admin`)

Esta subpasta não manipula apenas elementos do DOM visual. Os scripts aqui protegem as fronteiras de acesso à aplicação!

- `01-authAt.js`: Dispara o gatilho Sudo (Super User) efetuando disparos limpos (`wipe`) de todo o banco de dados principal de um Fórum após atestar a credencial.
- `02-listAt.js`: Monitora submissões complexas como o modal de Cadastro de Novos Setores/Usuários, injetando Array de setores customizáveis no backend via requisições assíncronas.
- `03-pageAdmin.js`: Protege a interface multi-abas (Audiencia, Consulta, Servico). Escuta vazamentos ou trocas de setor ilegais por um ID local, cria bloqueios, aciona notificações push remotamente pós-timeout (5 minutos) sob o SO operante, e utiliza **Web Audio API** para injetar harmônicas (Bip Sine Synth) garantindo que nenhum hardware falhe por falta de pacotes mp3 de alerta.
