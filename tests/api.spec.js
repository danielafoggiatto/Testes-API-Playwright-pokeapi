import { test, expect } from '@playwright/test';
import { APIClient } from '../src/api-client.js';

test.describe('Testes de API com PokéAPI', () => {
  let apiClient;

  test.beforeEach(() => {
    apiClient = new APIClient('https://pokeapi.co/api/v2');
  });

  test('GET - Listar pokémons', async () => {
    const response = await apiClient.get('/pokemon?limit=10');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.results)).toBeTruthy();
    expect(response.data.results.length).toBeGreaterThan(0);
  });

  test('GET - Buscar pokémon por nome', async () => {
    const response = await apiClient.get('/pokemon/pikachu');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name', 'pikachu');
    expect(response.data).toHaveProperty('height');
    expect(response.data).toHaveProperty('weight');
    expect(Array.isArray(response.data.abilities)).toBeTruthy();
  });

  test('GET - Buscar pokémon por ID', async () => {
    const response = await apiClient.get('/pokemon/25');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', 25);
    expect(response.data).toHaveProperty('name');
    expect(Array.isArray(response.data.abilities)).toBeTruthy();
  });

  test('GET - Buscar tipos de pokémon', async () => {
    const response = await apiClient.get('/type');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.results)).toBeTruthy();
  });

  test('GET - Buscar pokémons por tipo', async () => {
    const response = await apiClient.get('/type/electric');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('name', 'electric');
    expect(Array.isArray(response.data.pokemon)).toBeTruthy();
  });

  test('GET - Buscar regiões', async () => {
    const response = await apiClient.get('/region');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.results)).toBeTruthy();
  });

  test('GET - Validar estrutura completa do pokémon', async () => {
    const response = await apiClient.get('/pokemon/charizard');
    const pokemon = response.data;

    expect(response.status).toBe(200);
    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name', 'charizard');
    expect(pokemon).toHaveProperty('height');
    expect(pokemon).toHaveProperty('weight');

    expect(Array.isArray(pokemon.types)).toBeTruthy();
    expect(pokemon.types.length).toBeGreaterThan(0);

    expect(Array.isArray(pokemon.abilities)).toBeTruthy();
    expect(pokemon.abilities.length).toBeGreaterThan(0);
  });

  test('GET - Validar tipos de dados do pokémon', async () => {
    const response = await apiClient.get('/pokemon/bulbasaur');
    const pokemon = response.data;

    expect(typeof pokemon.id).toBe('number');
    expect(typeof pokemon.name).toBe('string');
    expect(typeof pokemon.height).toBe('number');
    expect(typeof pokemon.weight).toBe('number');
    expect(Array.isArray(pokemon.types)).toBeTruthy();
  });

  test('GET - Validar erro 404 para pokémon inexistente', async () => {
    try {
      await apiClient.get('/pokemon/invalidname999');
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('GET - Erro para nome com caracteres inválidos', async () => {
    try {
      await apiClient.get('/pokemon/@@@');
      throw new Error('Request should have failed');
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });


  test('GET - Erro para ID negativo', async () => {
    try {
      await apiClient.get('/pokemon/-1');
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('GET - Paginação retorna quantidade correta', async () => {
    const limit = 7;
    const response = await apiClient.get(`/pokemon?limit=${limit}`);

    expect(response.status).toBe(200);
    expect(response.data.results.length).toBe(limit);
  });

  test('GET - Validar paginação com offset', async () => {
    const response1 = await apiClient.get('/pokemon?limit=5&offset=0');
    const response2 = await apiClient.get('/pokemon?limit=5&offset=5');

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.data.results[0].name).not.toBe(response2.data.results[0].name);
  });

  test('GET - Pokémon listado existe no endpoint de detalhe', async () => {
    const listResponse = await apiClient.get('/pokemon?limit=1');
    const pokemonName = listResponse.data.results[0].name;

    const detailResponse = await apiClient.get(`/pokemon/${pokemonName}`);

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.data.name).toBe(pokemonName);
  });

  test('GET - Tempo de resposta aceitável', async () => {
    const start = Date.now();
    const response = await apiClient.get('/pokemon/pikachu');
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });
});
