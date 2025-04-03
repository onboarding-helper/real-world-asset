// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   include: ['onfido-sdk-ui'],
  // },
  // css: {
  //   preprocessorOptions: {
  //     css: {
  //       additionalData: `@import "onfido-sdk-ui/dist/style.css";`,
  //     },
  //   },
  // },
  // server: {
  //   port: 3001,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //     },
  //   },
  //   historyApiFallback: true,
  // },
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
});