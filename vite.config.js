import glsl from 'vite-plugin-glsl'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                admin: resolve(__dirname, 'src/admin.html')
            }
        }
    },
    plugins:
        [
            glsl()
        ]
}