import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        tailwindcss(),
    ],
    define: {
        __DEV__: 'true',
    },
    server: {
        port: 5000,
        // опционально:
        strictPort: true, // если порт занят — упадёт, а не переключится на другой
        host: true,       // слушать на всех интерфейсах (0.0.0.0)
        open: true,       // открыть браузер автоматически
    },
})
