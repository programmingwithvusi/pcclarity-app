import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let isCI = 'http://localhost:5000';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            // All /api calls forwarded to your local C# API
            '/api': {
                target: isCI ? 'http://localhost:5000' : 'http://localhost:5001',
                changeOrigin: true,
                secure: false, // allows self-signed dev cert
            },
        },
    },
})