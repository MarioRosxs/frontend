// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
//

import { readFileSync } from 'fs';  // Import readFileSync directly
//import https from 'https';  // Uncomment this line if you need it
// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
//const fs = require('fs');

const llavePrivada = readFileSync('private.key');
const certificado = readFileSync('certificate.crt');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    https: {
      key: llavePrivada,
      cert: certificado,
      passphrase: 'Maya1862',
    },
    port: 3000,
    
  },
});
