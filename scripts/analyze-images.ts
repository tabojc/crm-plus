
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'docs', 'extracted_images');
const PRODUCTS_FILE = path.join(process.cwd(), 'docs', 'products_clean.json');

async function main() {
    // 1. Load Products
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    console.log(`Loaded ${products.length} products.`);

    // 2. Load Images
    const files = fs.readdirSync(IMAGES_DIR).sort(); // Sort by name to preserve order (img-000, img-001...)

    // Filter heuristics:
    // - Size > 10KB (ignore small icons)
    // - Ignore odd/smask if possible (though masking is hard to detect just by name, rely on size)
    const candidates = [];
    for (const file of files) {
        const filePath = path.join(IMAGES_DIR, file);
        const stats = fs.statSync(filePath);

        // Filter out small files (likely icons or masks)
        // Adjust threshold as needed. 30KB seems safe for product photos.
        if (stats.size > 20 * 1024) {
            candidates.push({ file, size: stats.size });
        }
    }

    console.log(`Found ${candidates.length} candidate images (size > 20KB).`);

    // 3. Dry Run Mapping
    console.log('\n--- MAPPING PREVIEW ---');
    const limit = Math.max(products.length, candidates.length);
    for (let i = 0; i < limit; i++) {
        const prod = products[i] ? products[i].name : '(No Product)';
        const img = candidates[i] ? `${candidates[i].file} (${Math.round(candidates[i].size / 1024)}KB)` : '(No Image)';

        console.log(`[${i}] ${prod.padEnd(50)} <--> ${img}`);
    }
}

main();
