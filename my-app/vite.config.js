import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});


// src/config.js
export const API_BASE_URL = "https://vitefait0-dhfcc2fnc7feg4ae.westeurope-01.azurewebsites.net";
