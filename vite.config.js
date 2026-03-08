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
        lmsRemote: {
          type: "script",
          name: "leave_management_system", // must match webpack name
          entry: "http://localhost:4205/remoteEntry.js",
          global: "leave_management_system",
        },
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
    cors: true, // Enable CORS for Module Federation
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
    exclude: ['empRemote', 'leave_management_system'],
  }
})