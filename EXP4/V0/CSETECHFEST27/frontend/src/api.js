const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getAdminToken() { return sessionStorage.getItem('hash_admin_token'); }
export function setAdminToken(token) { sessionStorage.setItem('hash_admin_token', token); }
export function clearAdminToken() { sessionStorage.removeItem('hash_admin_token'); }

export async function api(path, options = {}) {
  const { method='GET', body, token, raw=false } = options;
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    const err = new Error('Cannot reach the backend. Start the Node.js server and check VITE_API_URL.');
    err.status = 0; throw err;
  }
  if (raw) {
    if (!response.ok) {
      let message='Request failed';
      try { message=(await response.json()).message || message } catch {}
      const err=new Error(message); err.status=response.status; throw err;
    }
    return response.blob();
  }
  const data = await response.json().catch(()=>({}));
  if (!response.ok) { const err=new Error(data.message || 'Request failed'); err.status=response.status; throw err; }
  return data;
}
