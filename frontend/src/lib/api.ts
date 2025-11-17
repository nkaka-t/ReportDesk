import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!cfg.headers) cfg.headers = {} as any;
    (cfg.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    // small debug: indicate that an auth token was attached
    try { console.debug('[api] attaching auth token'); } catch (e) {}
  }
  return cfg;
});

// Response interceptor: show friendly messages for auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err?.response?.status;
      // lazy dynamic import of toast for ESM/browser environments
      if (status === 401) {
        import('sonner').then(({ toast }) => toast.error(err?.response?.data?.error || 'Unauthorized - please sign in')).catch(() => {});
      } else if (status === 403) {
        import('sonner').then(({ toast }) => toast.error(err?.response?.data?.error || 'Forbidden - you do not have permission')).catch(() => {});
      }
    } catch (e) {
      // swallow any error here to not break the original error
      console.warn('api interceptor error', e);
    }
    return Promise.reject(err);
  }
);

export default api;
