import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        empRemote: {
          type: 'module',
          name: 'empRemote',
          entry: 'http://localhost:4202/emsui/remoteEntry.js',
        },
        // LMS is loaded manually via script tag in App.jsx
      },
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: '^19.0.0',
          eager: false,
        },
        'react-dom': { 
          singleton: true, 
          requiredVersion: '^19.0.0',
          eager: false,
        },
        'react-router-dom': { 
          singleton: true, 
          requiredVersion: '^7.1.0',
          eager: false,
        },
      },
    }),
  ],
  server: { 
    port: 5200,
    cors: true,
  },
  preview: { 
    port: 4200,
    cors: true,
  },
  build: { 
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
  optimizeDeps: {
    exclude: ['empRemote'],
  },
})