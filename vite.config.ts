import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// RS Fit Club — Vite config.
// Target is es2020 so mid-range Android browsers get native module output with
// minimal downlevelling. Vendor code is split so the hero (which only needs
// gsap) is not blocked behind react-router or lenis.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('/lenis/')) return 'vendor-lenis';
          if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router';
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          return 'vendor';
        },
      },
    },
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
});
