import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // en desarrollo las llamadas a /api van al backend local (mismo origen, sin CORS)
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom', // un navegador simulado, para probar componentes
    globals: true, // permite usar describe, it y expect sin importarlos
    setupFiles: './src/configuracion.js',
    testTimeout: 15000, // los formularios largos con userEvent pueden pasar de 5 s en equipos lentos
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/configuracion.js', 'src/pruebas/**', 'src/**/*.test.{js,jsx}'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
})
