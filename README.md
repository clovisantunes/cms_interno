# 🩺 Painel Interno — Centro Médico Sapiranga

Sistema interno desenvolvido em **React + TypeScript**, com foco em **acesso rápido a serviços, documentação interna e ferramentas administrativas** do Centro Médico Sapiranga.

---

## 📋 Sobre o Projeto

O **Painel Interno do Centro Médico Sapiranga** foi criado para facilitar o acesso de colaboradores às principais ferramentas e informações da clínica.  
Com uma interface moderna e responsiva, o painel centraliza links de acesso rápido, documentos técnicos, manuais e integrações com sistemas externos como **Raio X CMS** e **Raio X Hospital**.

O sistema também conta com um **relógio em tempo real**, exibição da **data atual** e **localização dinâmica** (Sapiranga, RS), oferecendo uma experiência interativa e funcional.

---

## 🚀 Tecnologias Utilizadas

- ⚛️ **React.js** — Biblioteca para construção da interface.
- 🟦 **TypeScript** — Tipagem estática e maior segurança no desenvolvimento.
- 🧭 **React Router DOM** — Navegação entre rotas internas.
- 🎨 **SASS / CSS Modules** — Estilização customizada e responsiva.
- 🌍 **Moment.js / Day.js** — Manipulação e exibição de data e hora.
- 📱 **React Icons** — Ícones padronizados e intuitivos.
- 🔗 **APIs externas** — Links rápidos para ferramentas corporativas e WhatsApp.

---

## 🧱 Estrutura de Pastas

```bash
src/
├── assets/                # Imagens e ícones
├── components/            # Componentes reutilizáveis (Sidebar, Header, Clock, etc.)
├── pages/                 # Páginas principais do painel
├── services/              # Integrações com APIs e ChatVolt
├── hooks/                 # Hooks customizados (ex: useClock, useLocation)
├── styles/                # Estilos globais e variáveis de tema
├── App.tsx                # Estrutura principal da aplicação
└── main.tsx               # Ponto de entrada do React

```

# ⚙️ Como Executar Localmente
git clone https://github.com/seu-usuario/cms-painel-interno.git

# Acesse a pasta
cd cms-painel-interno

# Instale as dependências
npm install

# Execute o projeto

```bash
npm run dev

O projeto estará disponível em:
👉 http://localhost:5173
```

## 💡 Funcionalidades

- Menu lateral fixo com ícones e navegação fluida.

- Links de acesso rápido para setores:

- Medicina Assistencial

- Medicina do Trabalho

- Raio X CMS

- Raio X Hospital

- WhatsApp Institucional

- Sessão de Documentação com:

- Manual de Atendimento

- PCMSO

- ONRAD RAIO X INTER

- Emissão de Notas

- Relógio dinâmico com atualização em tempo real.

- Localização automática da unidade.

- Design responsivo e adaptado para desktop e tablets.


# 🧩 Possíveis Extensões Futuras

- Sistema de notificações e comunicados.


- Upload e versionamento de documentos internos.

## 👨‍💻 Desenvolvido por

Clovis Antunes
Full Stack Developer — LinkedIn

📍 Sapiranga, RS
📧 clovissantannaa@gmail.com
