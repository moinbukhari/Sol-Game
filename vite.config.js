import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
// /**
//  * https://vitejs.dev/config/
//  * @type { import('vite').UserConfig }
//  */

export default defineConfig({
  define: {
    global: {},
    process: {'env': {}}
  },
  plugins: [reactRefresh()],
  server: {
  
    hmr: {
      host: `some-ngrok-subdomain.loca.lt`,
      port: 443,
    }
  },
  
})
