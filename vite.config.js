import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built into docs/ rather than dist/ so GitHub Pages serves it straight from the
// main branch, no deploy branch needed. base:'./' keeps asset paths relative,
// which is what lets the same build work at a repo sub-path.
export default defineConfig({
  base: './',
  build: { outDir: 'docs', emptyOutDir: true },
  plugins: [react()],
})
