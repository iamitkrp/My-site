import glsl from 'vite-plugin-glsl'

export default {
    root: './',
    publicDir: 'static/',
    base: './',
    build:
    {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'src/index.html',
                admin: 'src/admin.html'
            }
        }
    },
    plugins:
        [
            glsl()
        ]
}