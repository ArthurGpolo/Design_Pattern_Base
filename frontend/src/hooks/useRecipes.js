import { useEffect, useState, useCallback } from 'react';

/**
 * Hook de dados `useRecipes`
 *
 * Ideia principal (design pattern):
 * - Centralizar em um único lugar toda a regra de:
 *   - buscar dados remotos (API)
 *   - controlar loading
 *   - controlar e expor erros
 * - O componente de UI só consome `recipes`, `loading`, `error`
 *   e não precisa saber como a requisição é feita.
 */

// URL base da API. Se um dia mudar (porta, domínio, etc)
// você altera só aqui.
const API_BASE_URL = 'http://localhost:8080';

/**
 * Custom Hook responsável por:
 * - Buscar a lista de receitas na API
 * - Expor o estado da requisição (dados, loading, erro)
 * - Oferecer uma função `refetch` para disparar nova busca sob demanda
 *
 * Aceita opções para funcionar bem com SSR:
 * - initialRecipes: lista inicial vinda do servidor
 * - fetchOnMount: se true, faz a busca automática no primeiro render
 */
export function useRecipes({ initialRecipes = [], fetchOnMount = true } = {}) {
  // Estado com a lista de receitas retornada pela API
  const [recipes, setRecipes] = useState(initialRecipes);
  // Estado que indica se há uma requisição em andamento
  const [loading, setLoading] = useState(false);
  // Estado para armazenar mensagem de erro (se houver)
  const [error, setError] = useState(null);

  /**
   * Função que faz a chamada à API.
   *
   * É memorizada com useCallback para:
   * - evitar recriar a função a cada render
   * - funcionar bem como dependência do useEffect
   */
  const fetchRecipes = useCallback(async () => {
    // Sempre que for buscar, marcamos como carregando
    setLoading(true);
    // Limpamos erro anterior (se houver) antes de nova tentativa
    setError(null);

    try {
      // Chamada HTTP para a API de receitas
      const response = await fetch(`${API_BASE_URL}/recipes`);

      // Se a resposta veio com status de erro (4xx / 5xx),
      // disparamos uma exception para cair no catch
      if (!response.ok) {
        throw new Error(`Erro ao buscar receitas (status ${response.status})`);
      }

      // Convertemos o JSON e salvamos no estado
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      // Caso dê erro de rede, CORS, servidor, etc,
      // guardamos uma mensagem amigável em `error`
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      // Independente de sucesso ou erro, o loading termina aqui
      setLoading(false);
    }
  }, []);

  /**
   * useEffect pode disparar automaticamente a primeira busca de receitas,
   * dependendo da flag `fetchOnMount`. Isso permite usar o hook tanto em:
   * - páginas puramente client-side (fetchOnMount = true, padrão)
   * - páginas com SSR que já passam dados iniciais (fetchOnMount = false)
   */
  useEffect(() => {
    if (!fetchOnMount) return;
    fetchRecipes();
  }, [fetchOnMount, fetchRecipes]);

  /**
   * O hook retorna um "objeto de estado remoto" para o componente:
   * - recipes: dados
   * - loading: booleano indicando carregamento
   * - error: mensagem de erro (ou null)
   * - refetch: função para re-buscar os dados quando você quiser
   */
  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
  };
}