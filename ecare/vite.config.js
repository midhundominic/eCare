// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'
// import path from 'path'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     https: false, // Set to false for local development
//   },
//   define: {
//     'process.env': {}
//   }
// })

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return defineConfig({
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 5500,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            agora: ['agora-rtc-sdk-ng'],
          },
        },
      },
    },
    server: {
      historyApiFallback: true,
    },
    define: {
      // Make env variables available to the client
      'import.meta.env.VITE_AGORA_APP_ID': JSON.stringify(env.VITE_AGORA_APP_ID),
      // Add any other environment variables you need
    },
    optimizeDeps: {
      include: ['agora-rtc-sdk-ng'],
    },
  });
};
