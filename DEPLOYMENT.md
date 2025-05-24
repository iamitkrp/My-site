# Deployment Guide

## Cursor Fix Applied

The custom cursor functionality was not working on Vercel due to missing JavaScript and CSS files in the build output. This has been fixed by:

1. **Moving cursor files to static directory**: `cursor.js` and `cursor.css` are now in the `static/` folder
2. **Moving other JavaScript dependencies**: `background-effects.js` and `constellation.js` are also in `static/`
3. **Updated HTML references**: All script and CSS references now use absolute paths (`/filename.js`)
4. **Vite build process**: Files in `static/` are automatically copied to the build output

## Files Fixed

- `src/cursor.js` → `static/cursor.js`
- `src/cursor.css` → `static/cursor.css`
- `src/background-effects.js` → `static/background-effects.js`
- `src/constellation.js` → `static/constellation.js`

## Deployment to Vercel

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Deploy

3. **Verify cursor functionality**:
   - The custom cursor should now appear and work properly
   - Check browser console for any JavaScript errors

## Local Testing

To test locally after building:
```bash
npm run preview
```

The cursor should work in the preview as well. 