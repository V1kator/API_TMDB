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
  return key;
}

async function request(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', getApiKey());
  url.searchParams.set('language', 'pt-BR');
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    let message = `Erro ${res.status} ao consultar TMDB`;
    try {
      const body = await res.json();
      if (body?.status_message) message = body.status_message;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

export function searchMovies({ query, page = 1 }) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 });
  }
  return request('/search/movie', { query: trimmed, page, include_adult: false });
}

export function getMovieDetails(movieId) {
  return request(`/movie/${movieId}`, { append_to_response: 'credits' });
}

export function posterUrl(path, size = 'w342') {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path, size = 'w780') {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}
