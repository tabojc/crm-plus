
import fs from 'fs';
import path from 'path';

const vcfPath = path.join(process.cwd(), 'docs', '_Luisherr11 y 13.673 contactos más.vcf');

if (!fs.existsSync(vcfPath)) {
    console.error(`File not found: ${vcfPath}`);
    process.exit(1);
}

const content = fs.readFileSync(vcfPath, 'utf-8');
const lines = content.split(/\r?\n/);

let oldLogicCount = 0;
let newLogicCount = 0;

console.log('--- Analyze TEL Parsing ---');

for (const line of lines) {
    // Current Logic
    if (line.startsWith('TEL')) {
        oldLogicCount++;
    }

    // New Logic
    if (line.startsWith('TEL') || /^item\d+\.TEL/.test(line)) {
        newLogicCount++;
    }
}

console.log(`Lines starting with "TEL": ${oldLogicCount}`);
console.log(`Lines with improved "itemX.TEL" logic: ${newLogicCount}`);
console.log(`Potential recovered phones: ${newLogicCount - oldLogicCount}`);
