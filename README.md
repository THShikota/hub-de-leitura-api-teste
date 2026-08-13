# 📚 Hub de Leitura — Testes Automatizados de API

Projeto desenvolvido para praticar e demonstrar a **automação de testes de API utilizando Cypress**.

Os testes foram realizados sobre a API do **Hub de Leitura**, disponibilizada pela **EBAC**, com foco nas funcionalidades relacionadas à **gestão de usuários**.

O projeto contempla diferentes operações HTTP, autenticação, validação de respostas e criação dinâmica de dados para tornar os testes mais independentes e reutilizáveis.

---

## 🚀 Tecnologias utilizadas

* **JavaScript**
* **Node.js**
* **Cypress**
* **cypress-plugin-api**
* **API REST**

---

## 🧪 Cenários automatizados

Os testes estão organizados de acordo com os principais métodos HTTP utilizados pela API.

### GET — Consulta de usuários

Foram implementados testes para:

* Listar usuários cadastrados;
* Validar o status code da resposta;
* Validar propriedades dos usuários retornados;
* Buscar um usuário específico por ID;
* Realizar consultas utilizando filtros e paginação.

### POST — Cadastro de usuários

Foram implementados cenários para:

* Cadastrar um novo usuário com sucesso;
* Gerar nome e e-mail dinamicamente durante a execução;
* Validar o status code `201`;
* Validar a mensagem retornada pela API;
* Validar erro ao tentar cadastrar um usuário utilizando um e-mail em formato inválido.

### PUT — Atualização de usuários

Os testes de atualização contemplam:

* Atualização de um usuário existente;
* Validação do status code `200`;
* Validação da mensagem de sucesso;
* Criação dinâmica de um usuário antes da atualização;
* Utilização do ID retornado pela API para executar o teste sem depender de um usuário previamente cadastrado.

### DELETE — Exclusão de usuários

Foram implementados cenários para:

* Excluir usuários através do endpoint de remoção;
* Criar um usuário dinamicamente antes da exclusão;
* Utilizar o ID retornado no cadastro para realizar a remoção;
* Validar o status code e a resposta da API.

---

## 🔐 Autenticação

Para acessar os endpoints protegidos, o projeto realiza uma requisição ao endpoint de login antes da execução dos testes.

Foi criado o comando customizado:

```javascript
cy.geraToken(email, senha)
```

O comando realiza a autenticação e retorna o token recebido pela API.

Esse token é armazenado antes da execução dos cenários e posteriormente enviado no header `Authorization` das requisições que necessitam de autenticação.

---

## ⚙️ Comandos customizados

O projeto utiliza **Custom Commands do Cypress** para reaproveitar ações utilizadas em diferentes cenários.

### `geraToken`

Responsável por realizar o login e retornar o token de autenticação.

```javascript
cy.geraToken(email, senha)
```

### `cadastrarUsuario`

Responsável por cadastrar um usuário e retornar o seu ID.

```javascript
cy.cadastrarUsuario(nome, email, senha)
```

Esse comando é utilizado principalmente nos testes dinâmicos de atualização e exclusão, reduzindo a dependência de dados previamente cadastrados na aplicação.

---

## 📁 Estrutura do projeto

```text
hub-de-leitura-api-teste/
│
├── cypress/
│   ├── e2e/
│   │   └── usuarios.cy.js
│   │
│   ├── fixtures/
│   │   └── example.json
│   │
│   └── support/
│       ├── commands.js
│       └── e2e.js
│
├── cypress.config.js
├── package.json
├── package-lock.json
└── .gitignore
```

### Principais arquivos

**`cypress/e2e/usuarios.cy.js`**

Contém os cenários automatizados relacionados à gestão de usuários.

**`cypress/support/commands.js`**

Contém os comandos customizados utilizados para autenticação e cadastro de usuários.

**`cypress.config.js`**

Contém as configurações do Cypress, incluindo a URL base utilizada pelas requisições:

```javascript
baseUrl: 'http://localhost:3000/api/'
```

---

## ▶️ Como executar o projeto

### Pré-requisitos

Antes de começar, é necessário possuir instalado:

* [Node.js](https://nodejs.org/)
* npm

Também é necessário que a API do **Hub de Leitura** esteja sendo executada localmente.

Por padrão, os testes esperam encontrar a API em:

```text
http://localhost:3000/api/
```

### 1. Clone este repositório

```bash
git clone https://github.com/EBAC-QE/hub-de-leitura-api
```

### 2. Acesse a pasta do projeto

```bash
cd hub-de-leitura-api
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie a API do Hub de Leitura

Certifique-se de que a API disponibilizada pela EBAC esteja em execução na porta configurada no projeto.

### 5. Abra o Cypress

```bash
npx cypress open
```

Selecione **E2E Testing** e execute o arquivo:

```text
cypress/e2e/usuarios.cy.js
```

Também é possível executar os testes diretamente pelo terminal:

```bash
npx cypress run
```

---

## 💡 Conceitos praticados

Durante o desenvolvimento deste projeto foram aplicados conceitos como:

* Automação de testes de API;
* Testes de API REST com Cypress;
* Requisições `GET`, `POST`, `PUT` e `DELETE`;
* Validação de status codes;
* Validação do body das respostas;
* Autenticação via token;
* Headers de autenticação;
* Query parameters;
* Cenários positivos e negativos;
* Custom Commands do Cypress;
* Criação dinâmica de massa de dados;
* Reutilização de código;
* Redução da dependência entre cenários de teste.

---

## 🎯 Objetivo do projeto

O objetivo deste projeto é colocar em prática conceitos de **Quality Assurance e automação de testes de API**, utilizando o Cypress não apenas para testes de interface, mas também para realizar e validar requisições diretamente aos endpoints de uma API REST.

A utilização de dados gerados dinamicamente e comandos customizados também busca tornar os testes mais reutilizáveis e menos dependentes do estado inicial da aplicação.

---

## 📌 Observações

Este projeto possui finalidade **educacional** e foi desenvolvido a partir do **Hub de Leitura disponibilizado pela EBAC** para prática de testes e automação.

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudos em **Quality Assurance e Automação de Testes**.
