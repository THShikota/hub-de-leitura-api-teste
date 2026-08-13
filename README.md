# 📚 Hub de Leitura --- Testes Automatizados de API

Projeto desenvolvido para praticar e demonstrar **automação de testes de
API com Cypress** utilizando a API REST do **Hub de Leitura**,
disponibilizada pela EBAC.

A suíte atualmente cobre funcionalidades de **gestão de usuários** e
**catálogo de livros**, incluindo autenticação, cenários positivos e
negativos, filtros, validação de contratos de resposta e criação
dinâmica de massa de dados.

------------------------------------------------------------------------

## 🚀 Tecnologias utilizadas

-   JavaScript
-   Node.js
-   Cypress
-   cypress-plugin-api
-   API REST

------------------------------------------------------------------------

## 🧪 Cenários automatizados

### 👤 Gestão de usuários

A suíte de usuários cobre operações `GET`, `POST`, `PUT` e `DELETE`, com
validações de status code, conteúdo das respostas e cenários negativos.

Entre os cenários implementados estão:

-   listagem e consulta de usuários;
-   filtros e paginação;
-   cadastro de usuários;
-   validação de dados inválidos;
-   atualização de usuários;
-   exclusão de usuários;
-   criação dinâmica de massa para reduzir dependência de dados fixos.

### 📖 Catálogo de livros

Também foram adicionados testes automatizados para o catálogo de livros.

#### GET --- Listagem de livros

Valida:

-   status code `200`;
-   retorno da lista de livros;
-   filtros por categoria e autor;
-   propriedades como `id`, `title`, `category` e `author`.

Exemplo de filtros utilizados:

``` javascript
qs: {
    category: 'Ficção',
    author: 'George Orwell'
}
```

#### GET --- Detalhes de um livro

Valida a consulta de um livro específico pelo ID e a estrutura completa
da resposta.

A resposta é validada considerando os objetos:

``` text
response.body
├── book
├── availability
└── statistics
```

Também são verificados campos e tipos importantes do livro, como:

-   `id`;
-   `title`;
-   `author`;
-   `isbn`;
-   `pages`;
-   `isAvailable`;
-   `recent_reviews`.

#### POST --- Cadastro de livro

Valida que um administrador autenticado consegue cadastrar um novo
livro.

O título é criado dinamicamente com `Date.now()` para diminuir conflitos
entre execuções:

``` javascript
const titulo = `Jogos Mortais ${Date.now()}`;
```

São validados:

-   status code `201`;
-   ID gerado;
-   título;
-   autor;
-   categoria;
-   quantidade total de cópias.

#### POST --- Cadastro com dados inválidos

Valida que a API rejeita dados inválidos, como um livro com título
vazio.

O teste utiliza:

``` javascript
failOnStatusCode: false
```

Isso permite validar intencionalmente respostas de erro da API, como:

-   status code `400`;
-   mensagem de validação retornada pelo backend.

#### PUT --- Atualização de livro

Valida que um administrador autenticado consegue atualizar os dados de
um livro existente.

São verificados:

-   status code `200`;
-   mensagem de sucesso retornada pela API.

#### DELETE --- Exclusão dinâmica de livro

O cenário de exclusão cria primeiro um livro exclusivamente para o teste
e utiliza o ID retornado pelo cadastro para removê-lo.

Fluxo:

``` text
Gerar token
    ↓
Cadastrar livro dinamicamente
    ↓
Obter ID do livro criado
    ↓
DELETE /books/{id}
    ↓
Validar status e mensagem
```

Essa abordagem evita depender de um ID fixo e reduz o risco de um teste
remover dados utilizados por outros cenários.

------------------------------------------------------------------------

## 🔐 Autenticação

Os endpoints protegidos exigem autenticação.

Antes dos cenários que utilizam permissões administrativas, o projeto
executa o comando:

``` javascript
cy.geraToken('admin@biblioteca.com', 'admin123')
```

O token retornado pelo endpoint de login é armazenado e enviado no
header `Authorization`:

``` javascript
headers: {
    Authorization: token
}
```

Exemplo do `beforeEach`:

``` javascript
let token

beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    })
})
```

------------------------------------------------------------------------

## ⚙️ Custom Commands

Os comandos customizados ficam em:

``` text
cypress/support/commands.js
```

### `geraToken`

Realiza o login e retorna o token de autenticação.

``` javascript
cy.geraToken(email, senha)
```

### `cadastrarUsuario`

Cria um usuário para ser utilizado como massa de teste.

``` javascript
cy.cadastrarUsuario(nome, email, senha)
```

O comando permite criar dados dinamicamente para cenários como
atualização e exclusão.

### `cadastrarLivro`

Cria um livro autenticado para ser utilizado pelos testes do catálogo.

``` javascript
cy.cadastrarLivro(
    token,
    titulo,
    autor,
    categoria,
    totalCopias
)
```

Exemplo:

``` javascript
const titulo = `Livro para Deletar ${Date.now()}`

cy.cadastrarLivro(
    token,
    titulo,
    'Autor para Deletar',
    'Categoria para Deletar',
    1
).then((responseCadastro) => {
    const bookId = responseCadastro.body.book.id

    cy.api({
        method: 'DELETE',
        url: `books/${bookId}`,
        headers: {
            Authorization: token
        }
    })
})
```

O retorno do cadastro permite acessar o ID recém-criado e reutilizá-lo
no mesmo fluxo de teste.

------------------------------------------------------------------------

## 📁 Estrutura do projeto

``` text
hub-de-leitura-api-teste/
│
├── cypress/
│   ├── e2e/
│   │   ├── usuarios.cy.js
│   │   └── catalogo-livros.cy.js
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
├── README.md
└── .gitignore
```

### Arquivos principais

**`cypress/e2e/usuarios.cy.js`**\
Contém os cenários automatizados relacionados à gestão de usuários.

**`cypress/e2e/catalogo-livros.cy.js`**\
Contém os cenários de listagem, consulta, cadastro, validação negativa,
atualização e exclusão de livros.

**`cypress/support/commands.js`**\
Centraliza comandos reutilizáveis para autenticação e criação de massa
dinâmica.

**`cypress.config.js`**\
Contém as configurações do Cypress, incluindo a URL base da API:

``` javascript
baseUrl: 'http://localhost:3000/api/'
```

------------------------------------------------------------------------

## ▶️ Como executar

### Pré-requisitos

É necessário ter instalado:

-   Node.js;
-   npm;
-   API do Hub de Leitura executando localmente.

Por padrão, os testes esperam a API em:

``` text
http://localhost:3000/api/
```

### 1. Instale as dependências

Na pasta deste projeto de testes:

``` bash
npm install
```

### 2. Inicie a API

Execute o projeto da API do Hub de Leitura e confirme que ela está
disponível na URL configurada no Cypress.

### 3. Abra o Cypress

``` bash
npx cypress open
```

Selecione **E2E Testing** e escolha uma das specs:

``` text
cypress/e2e/usuarios.cy.js
cypress/e2e/catalogo-livros.cy.js
```

### 4. Execução em modo headless

Para executar toda a suíte pelo terminal:

``` bash
npx cypress run
```

------------------------------------------------------------------------

## 💡 Conceitos praticados

Durante o projeto foram aplicados conceitos como:

-   automação de testes de API;
-   API REST;
-   métodos `GET`, `POST`, `PUT` e `DELETE`;
-   validação de status codes;
-   validação de propriedades e tipos do response body;
-   autenticação via token;
-   headers de autorização;
-   query parameters;
-   filtros e paginação;
-   cenários positivos e negativos;
-   `failOnStatusCode: false` para validação de erros esperados;
-   Custom Commands do Cypress;
-   criação dinâmica de massa de dados;
-   encadeamento de requisições;
-   reutilização do ID retornado por uma requisição;
-   redução da dependência de IDs e registros fixos;
-   testes mais independentes e reutilizáveis.

------------------------------------------------------------------------

## 🎯 Objetivo do projeto

O objetivo é aplicar conceitos de **Quality Assurance e automação de
testes de API**, utilizando Cypress para enviar requisições diretamente
aos endpoints e validar o comportamento da aplicação.

A evolução da suíte busca aumentar a independência dos testes por meio
da criação dinâmica de dados e da reutilização das respostas da própria
API. Um exemplo é o cenário de exclusão de livros, no qual o teste cria
um livro, captura seu ID e remove exatamente o registro criado durante a
execução.

------------------------------------------------------------------------

## 📌 Observações

Este projeto possui finalidade **educacional** e foi desenvolvido a
partir do **Hub de Leitura disponibilizado pela EBAC** para prática de
testes e automação.

Alguns cenários ainda podem ser evoluídos para eliminar totalmente
dependências de IDs fixos, criando a massa necessária durante a própria
execução do teste.

------------------------------------------------------------------------

## 👨‍💻 Autor

Desenvolvido como projeto de estudos em **Quality Assurance e Automação
de Testes**.
