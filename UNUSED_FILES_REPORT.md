# Unused Files Report

## Files Safe to Delete

### 1. Telephone 3D Model System (Completely Unused)
**Reason:** The telephone.js tries to append to element ID "telephone3D" which doesn't exist in the HTML.

#### Folders to Delete:
- `src/shaders/telephone/` (entire folder)
  - `telephone.js`
  - `fragment.glsl`
  - `vertex.glsl`
  - `textures/` folder
    - `Dial_baseColor.png`
    - `Handle_normal.png`
  - `scene.bin`
  - `scene.gltf`
  - `license.txt`

- `static/models/telephone/` (entire folder)
  - `textures/` folder
    - `Dial_baseColor.png`
    - `Handle_normal.png`
  - `scene.bin`
  - `scene.gltf`
  - `license.txt`

### 2. Unused Shader File
- `src/shaders/test/fragment1.glsl` (not imported or referenced anywhere)

## Files That Are Being Used (DO NOT DELETE)

### Images in `static/images/`:
- ✅ `logo_no_bg.png` - Used in HTML and imported in script.js
- ✅ `pacman.png` - Imported and loaded in script.js
- ✅ `castleBattle.png` - Imported and loaded in script.js
- ✅ `innovision.png` - Imported and loaded in script.js
- ✅ `trinity.png` - Imported and loaded in script.js
- ✅ `coAttainment.png` - Imported and loaded in script.js
- ✅ `cli_downloader.png` - Used in HTML
- ✅ `code_checker.png` - Used in HTML
- ✅ `distro_sync.png` - Used in HTML
- ✅ `DSA_Viz.png` - Used in HTML
- ✅ `temp_folio.png` - Used in HTML

### Textures in `static/textures/`:
- ✅ `6.png` - Used as imageDark in script.js
- ✅ `8.png` - Used as imageLight in script.js

### Audio in `static/Audio/`:
- ✅ `click.mp3` - Imported and used in script.js
- ✅ `hover.mp3` - Imported and used in script.js
- ✅ `bg.mp3` - Imported and used in script.js
- ✅ `licence.txt` - License file for audio

### Fonts in `static/Fonts/`:
- ✅ `st.woff2` - Used in CSS files
- ✅ `stx.woff2` - Used in CSS files

### Shaders in `src/shaders/test/`:
- ✅ `vertex.glsl` - Imported in script.js
- ✅ `fragment.glsl` - Imported in script.js

## Total Space That Can Be Freed
Approximately **6+ MB** of unused files can be removed.

## Action Required
You can safely delete the folders and files listed in the "Files Safe to Delete" section above. No code changes are needed since these files are not referenced anywhere in the codebase. 