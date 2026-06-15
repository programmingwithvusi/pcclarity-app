import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            // All /api calls forwarded to your local C# API
            '/api': {
                target: 'https://localhost:5001',
                changeOrigin: true,
                secure: false, // allows self-signed dev cert
            },
        },
    },
})