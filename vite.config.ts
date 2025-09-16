import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import child_process from 'child_process';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        __GIT_COMMIT__: JSON.stringify(
          child_process.execSync('git rev-parse HEAD').toString().trim()
        ),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
