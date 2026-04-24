import Constants from 'expo-constants';

const API_BASE = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getApiKey() {
  const key =
    Constants?.expoConfig?.extra?.tmdbApiKey ||
    Constants?.manifest?.extra?.tmdbApiKey;
  if (!key) {
    throw new Error(
      'TMDB API key não encontrada. Defina expo.extra.tmdbApiKey em app.json.'
    );
  }
  // Validate API key format (32 hex characters)
  if (!/^[a-f0-9]{32}$/i.test(key)) {
    throw new Error('TMDB API key inválida. Verifique o formato da chave.');
  }
  return key;
}

async function request(path, params = {}, signal) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', getApiKey());
  url.searchParams.set('language', 'pt-BR');
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    signal,
    timeout: 10000, // 10 second timeout
  });
  if (!res.ok) {
    let message = `Erro ${res.status} ao consultar TMDB`;
    try {
      const body = await res.json();
      if (body?.status_message) message = body.status_message;
    } catch (_) {}
    throw new Error(message);
  }
  
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error('Erro ao processar resposta do servidor');
  }
  return data;
}

export function searchMovies({ query, page = 1, signal }) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 });
  }
  // Sanitize input: remove special characters that could cause issues
  const sanitized = trimmed.replace(/[<>]/g, '');
  if (sanitized.length > 200) {
    throw new Error('Consulta muito longa. Use menos de 200 caracteres.');
  }
  return request('/search/movie', { query: sanitized, page, include_adult: false }, signal);
}

export function getMovieDetails(movieId, signal) {
  if (!movieId || isNaN(movieId)) {
    throw new Error('ID do filme inválido');
  }
  return request(`/movie/${movieId}`, { append_to_response: 'credits' }, signal);
}

export function posterUrl(path, size = 'w342') {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path, size = 'w780') {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}
