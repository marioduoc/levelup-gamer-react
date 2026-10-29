import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // un navegador simulado, para probar componentes
    globals: true, // permite usar describe, it y expect sin importarlos
    setupFiles: './src/configuracion.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/configuracion.js', 'src/**/*.test.{js,jsx}'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
})
