/**
 * ============================================================
 * Testes do endpoint /recipes
 * ============================================================
 *
 * Este arquivo serve como MODELO para os testes de outros endpoints.
 * Os alunos devem usar este arquivo como base para criar os testes
 * do endpoint /reviews (arquivo: review.test.js).
 *
 * Ferramentas utilizadas:
 *  - Vitest: framework de testes (describe, it, expect, beforeEach)
 *  - Supertest: faz requisições HTTP diretamente no app Express,
 *    sem precisar subir o servidor manualmente.
 *
 * Conceitos importantes:
 *  - describe(): agrupa testes relacionados (ex: todos os testes do GET /recipes)
 *  - it():       define um teste individual com uma responsabilidade clara
 *  - expect():   realiza uma assertion — verifica se o resultado é o esperado
 *  - beforeEach(): executa uma função antes de CADA teste do grupo
 */

import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';

// Importamos o app Express e a função de reset do servidor.
// O supertest usa o app para criar um servidor HTTP temporário nos testes.
// Isso significa que NÃO precisamos rodar `npm start` para testar.
import serverModule from '../src/server.js';  //poderia ser o controller de um endpoint
import { raw } from 'express';

const { app, resetState } = serverModule;

// Criamos uma instância do supertest com o nosso app.
// A partir daqui, usamos `request.get(...)`, `request.post(...)`, etc.
const request = supertest(app);

// ============================================================
// Dados de exemplo reutilizados nos testes
// ============================================================

/**
 * Uma receita válida — todos os campos obrigatórios com os tipos corretos.
 * Usamos o spread operator (...receitaValida) para criar variações dela
 * nos testes de validação.
 */
const reviewValida = {
    rating: 5,
    comment: "Ficou maravilhoso, recomendo!",
    author: "João",
};

const receitaValida = {
    title: 'Bolo de Cenoura',
    description: 'Um bolo delicioso e bem fofinho.',
    prepTime: 45,
    ingredients: ['3 cenouras', '2 xícaras de farinha', '3 ovos'],
    steps: ['Bater tudo no liquidificador', 'Assar por 40 minutos'],
};

// ============================================================
// Suíte principal de testes
// ============================================================

describe('Endpoint /recipes', () => {
    /**
     * beforeEach: executado antes de CADA teste dentro deste describe.
     *
     * Aqui resetamos o estado do servidor (listas de receitas e reviews)
     * para garantir que os testes sejam independentes entre si.
     *
     * Sem isso, dados criados em um teste poderiam vazar para o próximo,
     * causando falhas imprevisíveis.
     */
    beforeEach(() => {
        resetState();
    });

    // ============================================================
    // GET /reviews
    // ============================================================

    describe('GET /reviews — Listar todas as avaliações de receitas', () => {
        it('deve retornar status 200 e um array vazio quando não há avaliações', async () => {
            const response = await request.get('/reviews');

            // Status 200 OK: requisição bem-sucedida
            expect(response.status).toBe(200);

            // O body deve ser um array vazio, pois ainda não criamos nada
            expect(response.body).toEqual([]);
        });

        it('deve retornar todas as avaliações de receitas cadastradas', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;

            // Primeiro criamos duas receitas para popular o banco
            await request.post(`/recipes/${id}/reviews`).send(reviewValida);
            await request.post(`/recipes/${id}/reviews`).send({ ...reviewValida, author: 'João' });

            const response = await request.get('/reviews');

            expect(response.status).toBe(200);

            // toHaveLength: verifica o tamanho do array retornado
            expect(response.body)
        });

        it('deve retornar os dados corretos de cada review', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            await request.post(`/recipes/${id}/reviews`).send(reviewValida);

            const response = await request.get('/reviews');

            // toMatchObject: verifica se o objeto contém ao menos esses campos
            // (ignora campos extras como `id`)
            expect(response.body[0]).toMatchObject(reviewValida);
        });
    });

    // ============================================================
    // POST /recipes/:id/reviews
    // ============================================================

    describe('POST /recipes/:id/reviews — Criar uma nova avaliação de uma receita', () => {
        it('deve criar uma avaliação de uma receita e retornar status 201 com os dados criados', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            const response = await request.post(`/recipes/${id}/reviews`).send(reviewValida);

            // Status 201 Created: recurso criado com sucesso
            expect(response.status).toBe(201);

            // A resposta deve conter todos os campos enviados...
            expect(response.body).toMatchObject(reviewValida);

            // ...mais um ID numérico gerado pelo servidor
            expect(response.body.id).toBeDefined();
            expect(typeof response.body.id).toBe('number');
        });

        it('deve retornar 400 quando o corpo da requisição está vazio', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            // Enviamos um objeto vazio — todos os campos obrigatórios faltam
            const response = await request.post(`/recipes/${id}/reviews`).send({});

            // Status 400 Bad Request: dados inválidos
            expect(response.status).toBe(400);

            // O servidor deve explicar o erro em uma mensagem
            expect(response.body.message).toBeDefined();
        });

        it('deve retornar 400 quando "author" não é uma string', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            // Usamos spread para copiar a receita válida e sobrescrever só o campo inválido
            const reviewInvalida = { ...reviewValida, author: 123 };

            const response = await request.post(`/recipes/${id}/reviews`).send(reviewInvalida);

            expect(response.status).toBe(400);
        });

        it('deve retornar 400 quando "comment" não é uma string', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            const reviewInvalida = { ...reviewValida, comment: true };

            const response = await request.post(`/recipes/${id}/reviews`).send(reviewInvalida);

            expect(response.status).toBe(400);
        });

        it('deve retornar 400 quando "rating" não é um número', async () => {
            const postResponse = await request.post('/recipes').send(receitaValida);
            const { id } = postResponse.body;
            // prepTime deve ser number, não string
            const reviewInvalida = { ...reviewValida, rating: '5 estrelas' };

            const response = await request.post(`/recipes/${id}/reviews`).send(reviewInvalida);

            expect(response.status).toBe(400);
        });
    });

    // ============================================================
    // GET /reviews/:id
    // ============================================================

    describe('GET /reviews/:reviewId — Buscar receita por ID', () => {
        it('deve retornar a review correta quando o ID existe', async () => {
            // cria receita
            const postResponseRecipe = await request.post('/recipes').send(receitaValida);
            const { id: recipeId } = postResponseRecipe.body;

            // cria review
            const postResponse = await request.post(`/recipes/${recipeId}/reviews`).send(reviewValida);
            const { id: reviewId } = postResponse.body;

            // busca review
            const getResponse = await request.get(`/reviews/${reviewId}`);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.id).toBe(reviewId);
            expect(getResponse.body.author).toBe(reviewValida.author);
        });

        it('deve retornar 404 quando a review não existe', async () => {
            // ID 9999 não existe — esperamos um Not Found
            const response = await request.get('/reviews/9999');

            // Status 404 Not Found: recurso não encontrado
            expect(response.status).toBe(404);
            expect(response.body.message).toBeDefined();
        });
    });

    // ============================================================
    // PUT /reviews/:reviewId
    // ============================================================

    describe('PUT /reviews/:reviewId — Atualizar uma avaliação', () => {
        it('deve atualizar a avaliação e retornar os dados atualizados', async () => {
            // cria receita
            const postResponseRecipe = await request.post('/recipes').send(receitaValida);
            const { id: recipeId } = postResponseRecipe.body;

            // cria review
            const postResponse = await request.post(`/recipes/${recipeId}/reviews`).send(reviewValida);
            const { id: reviewId } = postResponse.body;

            // Passo 2: prepara os dados atualizados (mantemos os outros campos)
            const dadosAtualizados = {
                ...reviewValida,
                author: 'Pedro',
                rating: 2,
            };

            // Passo 3: envia o PUT com os novos dados
            const putResponse = await request.put(`/reviews/${reviewId}`).send(dadosAtualizados);

            expect(putResponse.status).toBe(200);

            // O ID deve se manter o mesmo após a atualização
            expect(putResponse.body.id).toBe(reviewId);
            expect(putResponse.body.author).toBe('Pedro');
            expect(putResponse.body.rating).toBe(2);
        });

        it('deve persistir a atualização (GET após PUT deve retornar dados novos)', async () => {
            // cria receita
            const postResponseRecipe = await request.post('/recipes').send(receitaValida);
            const { id: recipeId } = postResponseRecipe.body;

            // cria review
            const postResponse = await request.post(`/recipes/${recipeId}/reviews`).send(reviewValida);
            const { id: reviewId } = postResponse.body;

            const dadosAtualizados = { ...reviewValida, author: 'Author Atualizado' };
            await request.put(`/reviews/${reviewId}`).send(dadosAtualizados);

            // Verificamos se a mudança realmente foi salva fazendo um GET depois
            const getResponse = await request.get(`/reviews/${reviewId}`);
            expect(getResponse.body.author).toBe('Author Atualizado');
        });

        it('deve retornar 404 ao tentar atualizar uma avaliação inexistente', async () => {
            const response = await request.put('/reviews/9999').send(reviewValida);

            expect(response.status).toBe(404);
        });

        it('deve retornar 400 ao tentar atualizar com dados inválidos', async () => {
            // cria receita
            const postResponseRecipe = await request.post('/recipes').send(receitaValida);
            const { id: recipeId } = postResponseRecipe.body;

            // cria review
            const postResponse = await request.post(`/recipes/${recipeId}/reviews`).send(reviewValida);
            const { id: reviewId } = postResponse.body;

            // prepTime inválido: string em vez de number
            const dadosInvalidos = { ...reviewValida, rating: '2' };
            const response = await request.put(`/reviews/${reviewId}`).send(dadosInvalidos);

            expect(response.status).toBe(400);
        });
    });

    // ============================================================
    // DELETE /reviews/:reviewId
    // ============================================================

    describe('DELETE /reviews/:reviewId — Remover uma avaliação', () => {
        it('deve remover a avaliação e retornar status 204 sem body', async () => {
            // cria receita
            const postResponseRecipe = await request.post('/recipes').send(receitaValida);
            const { id: recipeId } = postResponseRecipe.body;

            // cria review
            const postResponse = await request.post(`/recipes/${recipeId}/reviews`).send(reviewValida);
            const { id: reviewId } = postResponse.body;

            const deleteResponse = await request.delete(`/reviews/${reviewId}`);

            // Status 204 No Content: operação bem-sucedida, sem corpo de resposta
            expect(deleteResponse.status).toBe(204);

            // O body de um 204 deve ser vazio
            expect(deleteResponse.body).toEqual({});
        });

        it('deve realmente remover a avaliação (GET após DELETE retorna 404)', async () => {
            const postResponse = await request.post('/recipes/:id/reviews').send(reviewValida);
            const { reviewId } = postResponse.body;

            // Remove a receita
            await request.delete(`/reviews/${reviewId}`);

            // Tenta buscar a receita removida — deve retornar 404
            const getResponse = await request.get(`/reviews/${reviewId}`);
            expect(getResponse.status).toBe(404);
        });

        it('deve remover da lista (GET /reviews não deve mais incluir a receita)', async () => {
            const postResponse = await request.post('/recipes/:id/reviews').send(reviewValida);
            const { reviewId } = postResponse.body;

            await request.delete(`/reviews/${reviewId}`);

            const listResponse = await request.get('/reviews');

            // Nenhuma receita na lista deve ter o ID removido
            const ids = listResponse.body.map((r) => r.id);
            expect(ids).not.toContain(reviewId);
        });

        it('deve retornar 404 ao tentar remover uma avaliação inexistente', async () => {
            const response = await request.delete('/reviews/9999');

            expect(response.status).toBe(404);
        });
    });
});