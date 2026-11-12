import { defineConfig } from 'vite';

// Percorsi relativi: il sito funziona sia in locale sia sotto /<repo>/ su GitHub Pages.
export default defineConfig({ base: './' });
