
import fs from 'fs';
import path from 'path';

const IMAGE_LIST_PATH = path.join(process.cwd(), 'docs', 'image_list.txt');
const PRODUCTS_FILE = path.join(process.cwd(), 'docs', 'products_clean.json');
const OUTPUT_MAPPING = path.join(process.cwd(), 'docs', 'image_mapping.json');

async function main() {
    // 1. Parse Image List Metadata
    const listContent = fs.readFileSync(IMAGE_LIST_PATH, 'utf-8');
    const lines = listContent.split('\n');

    // Skip header lines (find the line starting with "page")
    let startIdx = 0;
    while (startIdx < lines.length && !lines[startIdx].startsWith('page')) {
        startIdx++;
    }
    startIdx += 2; // Skip header and separator line

    const validImages = [];

    // Regex to parse the fixed-width table or whitespace-separated table from pdfimages
    // Format: page   num  type   width height ...
    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(/\s+/);
        if (parts.length < 5) continue;

        const page = parts[0];
        const num = parts[1];
        const type = parts[2]; // 'image', 'smask', 'stencil'
        const width = parseInt(parts[3], 10);
        const height = parseInt(parts[4], 10);

        // pdfimages -all outputs filenames like img-000.png, img-001.jpg
        // The 'num' column in -list usually maps to the file index if extracted sequentially?
        // Actually, pdfimages names files sequentially 000, 001 based on extraction order.
        // The list order matches extraction order.
        // Let's assume list index 'i' (relative to start) maps to file index 'k'.
        // But we need to use the LINE index to infer the filename number.

        // Wait, pdftools outputs sequentially. The 'list' output lists ALL objects.
        // Extraction with -all ALSO extracts all objects.
        // So the Nth line in the list corresponds to `img-{N.toString().padStart(3, '0')}.ext`

        const fileIndex = i - startIdx;
        const fileSuffix = fileIndex.toString().padStart(3, '0');

        // We don't know the extension (.jpg, .png, .pbm) for sure without checking the file system
        // But we can check which file exists for that index.

        // Filter Rules
        const isMask = type === 'smask' || type === 'stencil';
        const isSmall = width < 300 || height < 300; // Icons/logos

        if (!isMask && !isSmall) {
            validImages.push({
                index: fileIndex,
                width,
                height,
                type
            });
        }
    }

    console.log(`Parsed ${lines.length - startIdx} total objects.`);
    console.log(`Found ${validImages.length} candidate product images.`);

    // 2. Load Products
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    console.log(`Loaded ${products.length} products.`);

    // 3. Map
    const mapping = [];
    const limit = Math.max(products.length, validImages.length);

    console.log('\n--- MAPPING PREVIEW (First 50) ---');
    for (let i = 0; i < limit; i++) {
        const prod = products[i] ? products[i].name : '(No Product)';
        const imgMeta = validImages[i];

        let imgFile = '(No Image)';
        if (imgMeta) {
            // Find the actual file extension
            const baseName = `img-${imgMeta.index.toString().padStart(3, '0')}`;
            const dir = path.join(process.cwd(), 'docs', 'extracted_images');
            const possibleExts = ['.jpg', '.png', '.ppm', '.pbm'];
            let found = false;
            for (const ext of possibleExts) {
                if (fs.existsSync(path.join(dir, baseName + ext))) {
                    imgFile = baseName + ext;
                    found = true;
                    break;
                }
            }
            if (!found) imgFile = `${baseName}.???`;

            imgFile += ` [${imgMeta.width}x${imgMeta.height}]`;
        }

        mapping.push({
            product: products[i] ? products[i] : null,
            imageFile: imgFile !== '(No Image)' ? imgFile.split(' ')[0] : null
        });

        if (i < 50) {
            console.log(`[${i}] ${prod.padEnd(50)} <--> ${imgFile}`);
        }
    }

    fs.writeFileSync(OUTPUT_MAPPING, JSON.stringify(mapping, null, 2));
    console.log(`\nMapping saved to ${OUTPUT_MAPPING}`);
}

main();
