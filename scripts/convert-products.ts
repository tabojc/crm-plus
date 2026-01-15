
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'docs', 'PRECIOS ENE 2026.xls');
const outputPath = path.join(process.cwd(), 'docs', 'products_clean.json');

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Raw data as array of arrays
const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Helper to clean price strings "$ 1.200,00 " -> 1200.00
const parsePrice = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;

    // String cleanup: remove $ and whitespace
    let clean = val.toString().replace(/[$\s]/g, '');

    // Handle European/Venezuelan format: 1.200,00 -> 1200.00
    // If it contains comma and dot, assume dot is thousands sep
    if (clean.includes('.') && clean.includes(',')) {
        clean = clean.replace(/\./g, '').replace(',', '.');
    } else if (clean.includes(',')) {
        // If only comma, it's decimal separator
        clean = clean.replace(',', '.');
    }

    return parseFloat(clean) || 0;
};

const products = [];

// Skip Header (Row 0)
for (let i = 1; i < rawData.length; i++) {
    const row: any = rawData[i];
    if (!row || row.length === 0) continue;

    const name = row[0];
    if (!name) continue; // Skip empty names

    const priceMin = parsePrice(row[1]);
    const priceList = parsePrice(row[2]);
    const priceOffer = parsePrice(row[3]);

    products.push({
        name: name.trim(),
        price_list: priceList,
        price_min: priceMin,
        price_offer: priceOffer,
        in_stock: true,
        // Description can be added later if needed
    });
}

fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

console.log(`Conversion Complete.`);
console.log(`Processed: ${products.length} products.`);
console.log(`Saved to: ${outputPath}`);
