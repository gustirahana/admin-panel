import axios from 'axios'
import { generateSignature } from './crypto'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  }
})

// Attach X-App-Signature + Bearer token on every request
api.interceptors.request.use(config => {
  // Regenerate signature each request (new encrypted value)
  config.headers['X-App-Signature'] = generateSignature()

  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`

  return config
})

// 401 → force logout
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
