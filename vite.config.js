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
          name: 'empRemote', // This must match the 'name' field in the REMOTE's config
          entry: 'http://localhost:4202/emsui/remoteEntry.js',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^7.1.0' },
      },
    }),
  ],
  server: { port: 5200 },
  // This is what npx vite preview uses
  preview: { port: 4200 },
  build: { target: 'esnext' },
  optimizeDeps: {
    exclude: ['empRemote'],
  },
})