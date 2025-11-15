#PousaPet - Backend

Este é o repositório do back-end do projeto PousaPet.

O PousaPet é uma plataforma que conecta voluntários dispostos a oferecer lar temporário a animais resgatados que se encontram em situação de vulnerabilidade, facilitando a ponte entre quem resgata e quem abriga.

## Tecnologias Utilizadas

O back-end foi construído com as seguintes tecnologias:

* **Runtime:** Node.js
* **Framework:** Express.js
* **Banco de Dados:** PostgreSQL
* **Autenticação:** JWT (JSON Web Tokens)
* **Hashing de Senhas:** Bcrypt.js
* **Conexão com BD:** node-postgres (pg)
* **CORS:** cors

### Infraestrutura (Deploy)

* **Banco de Dados:** Neon
* **Servidor (API):** Render
* **Frontend:** Vercel

---

## Como Rodar o Projeto Localmente

Para rodar este back-end na sua própria máquina, siga os passos:

### 1. Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando localmente.
* Um cliente de banco de dados (ex: DBeaver, PgAdmin) ou o Postman.

### 2. Instalação

1.  Clone o repositório e entre na pasta do back-end:
    ```bash
    git clone [https://github.com/alexia-create/Proj.Fullstack-LarTemporarioPet.git](https://github.com/alexia-create/Proj.Fullstack-LarTemporarioPet.git)
    cd Proj.Fullstack-LarTemporarioPet/backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie seu banco de dados PostgreSQL local (ex: `pousapet_db`).

4.  Execute o script `bancodedados.sql` no seu banco para criar todas as tabelas e tipos.

5.  **Configure as Variáveis de Ambiente:**
    * Este projeto **não** usa um arquivo `.env`. Você precisa configurar sua conexão com o banco diretamente no arquivo `db.js`.
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

Com tudo instalado e configurado, inicie o servidor:

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


