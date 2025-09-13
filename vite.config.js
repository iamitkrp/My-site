import glsl from 'vite-plugin-glsl'

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    // Load env from project root where .env.local lives
    envDir: '../',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        // Keep sourcemaps in dev only to avoid leaking source in prod
        sourcemap: process.env.NODE_ENV !== 'production',
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