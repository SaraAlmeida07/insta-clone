# 📸 InstaClone - Frontend

Uma aplicação moderna de rede social inspirada no Instagram, construída com **Vue 3**, **Vite** e **TypeScript**. Este projeto faz parte de um sistema completo que inclui um backend robusto para fornecer uma experiência de usuário fluida e responsiva.

---

## 🚀 Funcionalidades

- **Autenticação Completa**: Fluxos de Login, Cadastro e gerenciamento de sessão com persistência via `localStorage`.
- **Feed Dinâmico**: Visualização de posts com paginação infinita baseada em cursor.
- **Interação Social**: Sistema de curtidas (likes) e comentários.
- **Criação de Conteúdo**: Upload de imagens com suporte a múltiplos formatos e limite de tamanho, com preview instantâneo.
- **Descoberta de Usuários**: Sugestões de perfis para seguir.
- **Gestão de Perfil**: Visualização de perfis, grid de posts, contadores de seguidores/seguindo e edição de perfil.
- **Layout Responsivo**: Design adaptável com sidebar para desktop e barra de navegação inferior para dispositivos móveis.
- **Feedback Visual**: Estados de carregamento, mensagens de erro inline e validações de formulário.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado**: [Pinia](https://pinia.vuejs.org/)
- **Roteamento**: [Vue Router](https://router.vuejs.org/)
- **Estilização**: [Bootstrap 5](https://getbootstrap.com/) + Custom CSS (Modern Aesthetics)
- **Ícones**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Cliente HTTP**: [Axios](https://axios-http.com/)
- **Containerização**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🏁 Como Rodar o Projeto

### 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v20.19.0 ou superior)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional, para rodar via container)
- **Backend Rodando**: O frontend depende da API do [InstaClone Backend](../instaclone-backend) ativa.

---

### 💻 Rodando Localmente (Desenvolvimento)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd insta-clone
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto (ou copie o `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Certifique-se de que a variável `VITE_API_URL` aponta para o endereço do seu backend:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:5173`.

---

### 🐳 Rodando com Docker

Se preferir rodar a aplicação em um ambiente isolado:

1. **Certifique-se de que o Docker está ativo.**

2. **Suba o container usando o Docker Compose:**
   ```bash
   docker compose up --build
   ```
   Isso irá construir a imagem e iniciar o container. O frontend estará disponível em `http://localhost:3000`.

---

## 📂 Estrutura do Projeto

```
src/
├── assets/          # Estilos globais e recursos estáticos
├── components/      # Componentes Vue reutilizáveis (Feed, Perfil, UI)
├── composables/     # Lógica compartilhada (Upload de imagem, etc)
├── layouts/         # Layouts de página (AuthLayout, AppLayout)
├── router/          # Configurações de rotas e guards de autenticação
├── services/        # Cliente API centralizado e serviços de domínio
├── stores/          # Estado global gerenciado pelo Pinia
├── utils/           # Funções utilitárias (Formatação de datas, etc)
└── views/           # Páginas principais da aplicação
```

---

## 📄 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis:

| Variável | Descrição | Valor Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API do Backend | `http://localhost:8000/api` |

---

## 🤝 Contribuição

Sinta-se à vontade para abrir Issues ou enviar Pull Requests. Toda contribuição é bem-vinda!

---

Feito por [Sara Pereira de Almeida](https://github.com/SaraAlmeida07)
