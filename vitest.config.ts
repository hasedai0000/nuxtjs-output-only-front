import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()] as never,
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
