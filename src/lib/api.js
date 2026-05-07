// lib/api.js
const API = 'http://localhost:3000/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // 👈 auto-attach
      ...options.headers,
    }
  })

  if (res.status === 401) {
    // Token expired or invalid — force logout
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return res
}