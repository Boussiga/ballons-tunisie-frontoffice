import axios from 'axios'

// Empty in dev (Vite proxies /api to the API). In production, the API's URL.
export const API_URL = import.meta.env.VITE_API_URL || ''

export default axios.create({ baseURL: API_URL })
