import { createAuthClient } from "better-auth/react"
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const base = API_BASE_URL ? `${API_BASE_URL}` : ''
export const authClient = createAuthClient({
    
    baseURL:base
})