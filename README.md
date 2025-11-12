# design-compressor-figma-plugin

**Figma Design Compressor** is a plugin that allows designers to **compress selected images or frames directly inside Figma**, using the same powerful algorithms found in **[Squoosh.app](https://squoosh.app)**.  
The plugin reduces image size with **minimal quality loss**, improving performance of large design files and optimizing exported assets.

---

## Features

- Compress selected images or frames directly in Figma  
- Choose compression format: **PNG** or **WebP**  
- Adjust quality level (10–100%)  
- Preview **original vs. compressed** image  
- Export and download compressed image  
- Compare file sizes (original vs. compressed)  
- All processing happens **locally in Figma Desktop** — no server uploads

---

## Built With

- **Preact** – lightweight React alternative for UI  
- **Vite** – fast development and build tool  
- **TypeScript** – type-safe code  
- **Figma Plugin API** – for interacting with the Figma editor  
- **browser-image-compression** – for image optimization (client-side)

**Tested on:**

Figma Desktop (Linux and Windows)

---

## Local Setup

If you want to run or modify the plugin locally:

1. Clone the repository

2. npm install

3. npm run build

---

## Test

1. Load the plugin into Figma

2. Open Figma Desktop.

3. Go to Plugins -> Development -> Import plugin from manifest...

4. Select the manifest.json file from your project folder.

---

## Usage

1. Select any Frame or Image node in your Figma file.

2. Run the Design Compressor plugin.

3. Choose the desired format (PNG or WebP) and compression quality.

4. Preview the result and download the compressed version if satisfied.

