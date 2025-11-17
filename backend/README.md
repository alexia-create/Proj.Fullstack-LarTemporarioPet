#PousaPet - Backend

Este é o repositório do back-end do projeto PousaPet.

O PousaPet é uma plataforma que conecta voluntários dispostos a oferecer lar temporário a animais resgatados que se encontram em situação de vulnerabilidade, facilitando a ponte entre quem resgata e quem abriga.

## Tecnologias Utilizadas

O back-end foi construído com as seguintes tecnologias:

* Node.js
* Express.js
* PostgreSQL
* JWT (JSON Web Tokens)
* Bcrypt.js
* node-postgres (pg)
* cors

### Deploy

* **Banco de Dados:** Neon
* **Servidor (API):** Render
* **Frontend:** Vercel

---

## Como Rodar o Projeto Localmente

Para rodar este back-end localmente:

### 1. Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando localmente.
* Um cliente de banco de dados tipo por exemplo o PgAdmin.

### 2. Instalação

1.  Clonar o repositório e entrar na pasta do back-end:
    ```bash
    git clone [https://github.com/alexia-create/Proj.Fullstack-LarTemporarioPet.git](https://github.com/alexia-create/Proj.Fullstack-LarTemporarioPet.git)
    cd Proj.Fullstack-LarTemporarioPet/backend
    ```

2.  Instalar as dependências:
    ```bash
    npm install
    ```

3.  Criar um banco de dados PostgreSQL local.

4.  Executar o script `bancodedados.sql` no banco para criar todas as tabelas e tipos.

5.  **Configurar as Variáveis de Ambiente:**
    Você precisa configurar sua conexão com o banco diretamente no arquivo `db.js`.
    * **No `db.js`:** Altere o objeto `Pool` para se conectar ao seu banco local:
        ```javascript
        const pool = new Pool({
          user: 'postgres',
          host: 'localhost',
          database: 'pousapet_db',
          password: 'SUA_SENHA_DO_POSTGRES',
          port: 5432,
        });
        ```
    * **No `servidor.js`:** Altere a porta para `3000`:
        ```javascript
        const port = 3000;
        ```

### 3. Rodando o Servidor

Com tudo instalado e configurado, agora é iniciar o servidor:

```bash
node servidor.js
```

### 4. Estrutura de Endpoints da API 
O servidor tem os seguintes endpoints:

Usuários e Autenticação
POST /usuarios

Descrição: Cadastra um novo usuário.

Body: { "nome_completo", "email", "senha", "telefone", "cidade", "estado" }

POST /login

Descrição: Autentica um usuário e retorna um token JWT.

Body: { "email", "senha" }

Animais (CRUD)
POST /animais

Descrição: Cadastra um novo animal (requer token).

Auth: Bearer Token

Body: { "nome_animal", "tipo_animal", "porte", "historia_animal", ... }

GET /animais

Descrição: Lista todos os animais que estão "buscando_lar".

GET /animais/:id

Descrição: Busca os detalhes de um animal específico, incluindo dados do solicitante.

PUT /animais/:id

Descrição: Atualiza os dados de um animal (requer token e ser o dono do animal).

Auth: Bearer Token

DELETE /animais/:id

Descrição: Remove um animal (requer token e ser o dono do animal).

Auth: Bearer Token


