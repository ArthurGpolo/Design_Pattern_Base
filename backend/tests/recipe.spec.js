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
  // GET /recipes
  // ============================================================

  describe('GET /recipes — Listar todas as receitas', () => {
    it('deve retornar status 200 e um array vazio quando não há receitas', async () => {
      const response = await request.get('/recipes');

      // Status 200 OK: requisição bem-sucedida
      expect(response.status).toBe(200);

      // O body deve ser um array vazio, pois ainda não criamos nada
      expect(response.body).toEqual([]);
    });

    it('deve retornar todas as receitas cadastradas', async () => {
      // Primeiro criamos duas receitas para popular o banco
      await request.post('/recipes').send(receitaValida);
      await request.post('/recipes').send({ ...receitaValida, title: 'Pão de Queijo' });

      const response = await request.get('/recipes');

      expect(response.status).toBe(200);

      // toHaveLength: verifica o tamanho do array retornado
      expect(response.body).toHaveLength(2);
    });

    it('deve retornar os dados corretos de cada receita', async () => {
      await request.post('/recipes').send(receitaValida);

      const response = await request.get('/recipes');

      // toMatchObject: verifica se o objeto contém ao menos esses campos
      // (ignora campos extras como `id`)
      expect(response.body[0]).toMatchObject(receitaValida);
    });
  });

  // ============================================================
  // POST /recipes
  // ============================================================

  describe('POST /recipes — Criar uma nova receita', () => {
    it('deve criar uma receita e retornar status 201 com os dados criados', async () => {
      const response = await request.post('/recipes').send(receitaValida);

      // Status 201 Created: recurso criado com sucesso
      expect(response.status).toBe(201);

      // A resposta deve conter todos os campos enviados...
      expect(response.body).toMatchObject(receitaValida);

      // ...mais um ID numérico gerado pelo servidor
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('number');
    });

    it('deve retornar 400 quando o corpo da requisição está vazio', async () => {
      // Enviamos um objeto vazio — todos os campos obrigatórios faltam
      const response = await request.post('/recipes').send({});

      // Status 400 Bad Request: dados inválidos
      expect(response.status).toBe(400);

      // O servidor deve explicar o erro em uma mensagem
      expect(response.body.message).toBeDefined();
    });

    it('deve retornar 400 quando "title" não é uma string', async () => {
      // Usamos spread para copiar a receita válida e sobrescrever só o campo inválido
      const receitaInvalida = { ...receitaValida, title: 123 };

      const response = await request.post('/recipes').send(receitaInvalida);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando "description" não é uma string', async () => {
      const receitaInvalida = { ...receitaValida, description: true };

      const response = await request.post('/recipes').send(receitaInvalida);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando "prepTime" não é um número', async () => {
      // prepTime deve ser number, não string
      const receitaInvalida = { ...receitaValida, prepTime: '45 minutos' };

      const response = await request.post('/recipes').send(receitaInvalida);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando "ingredients" não é um array', async () => {
      const receitaInvalida = { ...receitaValida, ingredients: 'cenoura, farinha' };

      const response = await request.post('/recipes').send(receitaInvalida);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando "steps" não é um array', async () => {
      const receitaInvalida = { ...receitaValida, steps: 'Bater e assar' };

      const response = await request.post('/recipes').send(receitaInvalida);

      expect(response.status).toBe(400);
    });
  });

  // ============================================================
  // GET /recipes/:id
  // ============================================================

  describe('GET /recipes/:id — Buscar receita por ID', () => {
    it('deve retornar a receita correta quando o ID existe', async () => {
      // Passo 1: criamos uma receita e capturamos o ID gerado
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      // Passo 2: buscamos pelo ID
      const getResponse = await request.get(`/recipes/${id}`);

      expect(getResponse.status).toBe(200);

      // O ID retornado deve ser o mesmo que buscamos
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.title).toBe(receitaValida.title);
    });

    it('deve retornar 404 quando a receita não existe', async () => {
      // ID 9999 não existe — esperamos um Not Found
      const response = await request.get('/recipes/9999');

      // Status 404 Not Found: recurso não encontrado
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  // ============================================================
  // PUT /recipes/:id
  // ============================================================

  describe('PUT /recipes/:id — Atualizar uma receita', () => {
    it('deve atualizar a receita e retornar os dados atualizados', async () => {
      // Passo 1: cria a receita original
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      // Passo 2: prepara os dados atualizados (mantemos os outros campos)
      const dadosAtualizados = {
        ...receitaValida,
        title: 'Bolo de Cenoura Especial',
        prepTime: 60,
      };

      // Passo 3: envia o PUT com os novos dados
      const putResponse = await request.put(`/recipes/${id}`).send(dadosAtualizados);

      expect(putResponse.status).toBe(200);

      // O ID deve se manter o mesmo após a atualização
      expect(putResponse.body.id).toBe(id);
      expect(putResponse.body.title).toBe('Bolo de Cenoura Especial');
      expect(putResponse.body.prepTime).toBe(60);
    });

    it('deve persistir a atualização (GET após PUT deve retornar dados novos)', async () => {
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      const dadosAtualizados = { ...receitaValida, title: 'Título Atualizado' };
      await request.put(`/recipes/${id}`).send(dadosAtualizados);

      // Verificamos se a mudança realmente foi salva fazendo um GET depois
      const getResponse = await request.get(`/recipes/${id}`);
      expect(getResponse.body.title).toBe('Título Atualizado');
    });

    it('deve retornar 404 ao tentar atualizar uma receita inexistente', async () => {
      const response = await request.put('/recipes/9999').send(receitaValida);

      expect(response.status).toBe(404);
    });

    it('deve retornar 400 ao tentar atualizar com dados inválidos', async () => {
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      // prepTime inválido: string em vez de number
      const dadosInvalidos = { ...receitaValida, prepTime: 'muito tempo' };
      const response = await request.put(`/recipes/${id}`).send(dadosInvalidos);

      expect(response.status).toBe(400);
    });
  });

  // ============================================================
  // DELETE /recipes/:id
  // ============================================================

  describe('DELETE /recipes/:id — Remover uma receita', () => {
    it('deve remover a receita e retornar status 204 sem body', async () => {
      // Cria a receita para depois remover
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      const deleteResponse = await request.delete(`/recipes/${id}`);

      // Status 204 No Content: operação bem-sucedida, sem corpo de resposta
      expect(deleteResponse.status).toBe(204);

      // O body de um 204 deve ser vazio
      expect(deleteResponse.body).toEqual({});
    });

    it('deve realmente remover a receita (GET após DELETE retorna 404)', async () => {
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      // Remove a receita
      await request.delete(`/recipes/${id}`);

      // Tenta buscar a receita removida — deve retornar 404
      const getResponse = await request.get(`/recipes/${id}`);
      expect(getResponse.status).toBe(404);
    });

    it('deve remover da lista (GET /recipes não deve mais incluir a receita)', async () => {
      const postResponse = await request.post('/recipes').send(receitaValida);
      const { id } = postResponse.body;

      await request.delete(`/recipes/${id}`);

      const listResponse = await request.get('/recipes');

      // Nenhuma receita na lista deve ter o ID removido
      const ids = listResponse.body.map((r) => r.id);
      expect(ids).not.toContain(id);
    });

    it('deve retornar 404 ao tentar remover uma receita inexistente', async () => {
      const response = await request.delete('/recipes/9999');

      expect(response.status).toBe(404);
    });
  });
});