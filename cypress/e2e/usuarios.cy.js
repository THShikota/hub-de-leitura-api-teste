/// <reference types="cypress" />

let token;

before(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn 
    })
})

describe('GET - Teste de API - Gestão de Usuários', () => {
    it('Deve listar usuários com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: {
                'Authorization': token
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.users).to.be.an('array');
        })
    });

    it('Deve validar propriedades de um usuário', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: {
                'Authorization': token
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.users[0]).to.have.property('id');
            expect(response.body.users[0]).to.have.property('name');
            expect(response.body.users[0]).to.have.property('email');
        });
    });

    it('Deve listar um usuário com sucesso buscando por ID', () => {
        cy.api({
            method: 'GET',
            url: 'users/2',
            headers: {
                'Authorization': token
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('email');
        });
    });

    it('Deve listar um usuário com sucesso buscando pelos filtros', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: {
                'Authorization': token
            },
            qs:{
                page: 1,
                limit: 20,
                search: 'Padrão'
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.users).to.be.an('array');
            expect(response.body.users[0]).to.have.property('id');
            expect(response.body.users[0]).to.have.property('name');
            expect(response.body.users[0]).to.have.property('email');
        });
    });
});

describe('POST - Teste de API - Gestão de Usuários', () => {
    it('Deve cadastrar um usuário com sucesso', () => {
        let nome = `Teste ${Date.now()}`;
        let email = `teste${Date.now()}@email.com`;
        cy.api({
            method: 'POST',
            url: 'users',
            body:{
                "name": nome,
                "email": email,
                "password": "senha123"
            }
        }).should(response => {
            expect(response.status).to.equal(201);
            expect(response.body.message).to.equal('Usuário criado com sucesso.');
        })
    });

    it('Deve validar erro ao tentar cadastrar um usuário com email inválido', () => {
        cy.api({
            method: 'POST',
            url: 'users',
            body:{
                "name": "Maria Santos",
                "email": "teste5email.com",
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Formato de email inválido.');
        })
    });
});

describe('PUT - Teste de API - Gestão de Usuários', () => {
    it('Deve atualizar um usuário com sucesso', () => {
        let email = `teste${Date.now()}.alterado@email.com`;
        cy.api({
            method: 'PUT',
            url: 'users/11',
            headers: {
                'Authorization': token
            },
            body:{
                name: "João da Silva Santos Alterado",
                email: email,
                password: "novaSenha123alterada"
            }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.');
        })
    });

    it('Deve atualizar um usuário com sucesso - De forma dinamica', () => {
        let email = `teste${Date.now()}.alterado@email.com`;
        cy.cadastrarUsuario('Tiago', email, 'senha123').then(userId => {
           cy.api({
            method: 'PUT',
            url: 'users/' + userId,
            headers: {
                'Authorization': token
            },
            body:{
                name: "João da Silva Santos Alterado",
                email: email,
                password: "novaSenha123alterada"
            }
            }).should(response => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Usuário atualizado com sucesso.');
            }) 
        })
    });
});

describe('DELETE - Teste de API - Gestão de Usuários', () => {
    it.skip('Deve excluir um usuário com sucesso', () => {
        cy.api({
            method: 'DELETE',
            url: 'users/32',
            headers:{'Authorization': token}
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Usuário removido com sucesso.');
        })
    });

    it('Deve excluir um usuário com sucesso - De forma dinâmica', () => {
        cy.cadastrarUsuario('Deletar', 'email45@deletar.com', 'senha123').then(userId => {
           cy.api({
            method: 'DELETE',
            url: `users/${userId}`,
            headers:{'Authorization': token}
            }) 
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Usuário removido com sucesso.');
        })

    });
});