/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

    let token
    beforeEach(() => {
        cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
            token = tkn
        })
    });

    // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando
    // Validar que filtros por categoria e autores funcionam corretamente
    it('GET - Deve listar livros com filtros e paginação', () => {
        cy.api({
            method: 'GET',
            url: 'books',
            qs: {
                category: 'Ficção',
                author: 'George Orwell'
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.books).to.be.an('array');
            expect(response.body.books[0]).to.have.property('id');
            expect(response.body.books[0]).to.have.property('title');
            expect(response.body.books[0]).to.have.property('category');
            expect(response.body.books[0]).to.have.property('author');
        })
    });

    // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID
    // Verificar que todos os campos do livro são retornados corretamente
    it('GET - Deve obter detalhes de um livro específico', () => {
        cy.api({
            method: 'GET',
            url: 'books/2',
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.include.all.keys(
                'book',
                'availability',
                'statistics'
            );
            expect(response.body.book).to.include.all.keys(
                'id',
                'title',
                'author',
                'isbn',
                'editor',
                'category',
                'language',
                'publication_year',
                'pages',
                'format',
                'total_copies',
                'available_copies',
                'description',
                'cover_image',
                'created_at',
                'total_reservations',
                'active_reservations',
                'average_rating',
                'total_reviews',
                'isAvailable',
                'availability_status',
                'recent_reviews'
            );

            expect(response.body.book.id).to.equal(2);
            expect(response.body.book.title).to.equal('1984');
            expect(response.body.book.author).to.equal('George Orwell');
            expect(response.body.book.isbn).to.equal('978-0-452-28423-4');

            expect(response.body.book.id).to.be.a('number');
            expect(response.body.book.title).to.be.a('string');
            expect(response.body.book.author).to.be.a('string');
            expect(response.body.book.pages).to.be.a('number');
            expect(response.body.book.isAvailable).to.be.a('boolean');
            expect(response.body.book.recent_reviews).to.be.an('array');

        })
    });

    // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo
    // Verificar que apenas admin pode adicionar novos livros (validação de permissão)
    it('POST - Deve cadastrar um novo livro com sucesso', () => {
        let titulo = `Jogos Mortais ${Date.now()}`;
        cy.api({
            method: 'POST',
            url: 'books',
            headers: {
                'Authorization': token
            },
            body: {
                "title": titulo,
                "author": 'James Wan e Leigh Whannell',
                "category": "Terror",
                "total_copies": 3
            }
        }).should(response => {
            expect(response.status).to.equal(201);
            expect(response.body.book).to.have.property('id');
            expect(response.body.book).to.have.property('title');
            expect(response.body.book).to.have.property('author');
            expect(response.body.book).to.have.property('category');
        })
    });

    // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro
    // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
    it('POST -  Deve rejeitar livro com dados inválidos', () => {
        cy.api({
            method: 'POST',
            url: 'books',
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false,
            body: {
                "title": "",
                "author": "James Wan e Leigh Whannell",
                "category": "Terror",
                "total_copies": 3
            }
        }).should(response => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('\"title\" is not allowed to be empty');
        })
    });

    // Objetivo: Validar que um livro pode ser atualizado com sucesso
    // Verificar que apenas admin pode atualizar livros (validação de permissão)
    it.only('PUT - Deve atualizar um livro previamente cadastrado', () => {
        cy.api({
            method: 'PUT',
            url: 'books/28',
            headers: {
                'Authorization': token
            },
            body: {
                "title": "Jogos Mortais - Atualizado",
                "author": "Autor Atualizado",
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Livro atualizado com sucesso.');
        })
    });

    // Objetivo: Validar que um livro pode ser removido do catálogo
    // Verificar que apenas admin pode deletar livros (validação de permissão)
    it('DELETE - Deve deletar um livro previamente cadastrado', () => {
        //TODO: 
    });
});