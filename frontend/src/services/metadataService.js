import { fallbackMetadata } from '../data/metadataFallback';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function buildController() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  return { controller, timeout };
}

async function fetchJson(url) {
  const { controller, timeout } = buildController();
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (data === null || typeof data !== 'object') {
      throw new Error('API returned an invalid JSON payload');
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchCategories() {
  try {
    const data = await fetchJson(`${API_BASE}/categories`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // Graceful fallback when the backend is unreachable.
  }
  return fallbackMetadata.categories;
}

export async function fetchAllAlgorithms() {
  try {
    const data = await fetchJson(`${API_BASE}/algorithms`);
    if (data && typeof data === 'object' && Object.keys(data).length > 0) return data;
  } catch {
    // Graceful fallback when the backend is unreachable.
  }
  return fallbackMetadata.algorithms;
}

export async function fetchAlgorithmById(id) {
  if (typeof id !== 'string' || !id.trim()) return null;
  try {
    const data = await fetchJson(`${API_BASE}/algorithms/${encodeURIComponent(id)}`);
    if (data && typeof data === 'object' && typeof data.name === 'string') return data;
  } catch {
    // Graceful fallback when the backend is unreachable.
  }
  return fallbackMetadata.algorithms[id] || null;
}
