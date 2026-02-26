import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages にデプロイする場合は base を設定
  // 例: base: '/moji-renshu/',
})
