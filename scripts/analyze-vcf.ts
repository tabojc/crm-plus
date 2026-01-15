
import fs from 'fs';
import path from 'path';

const vcfPath = path.join(process.cwd(), 'docs', '_Luisherr11 y 13.673 contactos más.vcf');

// Check if file exists
if (!fs.existsSync(vcfPath)) {
    console.error(`File not found: ${vcfPath}`);
    process.exit(1);
}

const content = fs.readFileSync(vcfPath, 'utf-8');
const lines = content.split(/\r?\n/);

let cardCount = 0;
let stats = {
    hasFN: 0,
    hasTel: 0,
    hasWaid: 0,
    hasEmail: 0,
    hasOrg: 0,
};

let currentCard = {
    fn: false,
    tel: false,
    waid: false,
    email: false,
    org: false
};

console.log('--- Starting VCF Analysis ---');

for (const line of lines) {
    if (line.startsWith('BEGIN:VCARD')) {
        cardCount++;
        // Reset current card stats
        currentCard = { fn: false, tel: false, waid: false, email: false, org: false };
    } else if (line.startsWith('END:VCARD')) {
        // Commit stats
        if (currentCard.fn) stats.hasFN++;
        if (currentCard.tel) stats.hasTel++;
        if (currentCard.waid) stats.hasWaid++;
        if (currentCard.email) stats.hasEmail++;
        if (currentCard.org) stats.hasOrg++;
    } else {
        // Analyze fields
        if (line.startsWith('FN:')) currentCard.fn = true;
        if (line.startsWith('TEL')) {
            currentCard.tel = true;
            if (line.includes('waid=')) currentCard.waid = true;
        }
        if (line.startsWith('EMAIL')) currentCard.email = true;
        if (line.startsWith('ORG')) currentCard.org = true;
    }
}

console.log(`Total VCards found: ${cardCount}`);
console.log('--- Field Stats ---');
console.log(`Full Name (FN): ${stats.hasFN} (${(stats.hasFN / cardCount * 100).toFixed(1)}%)`);
console.log(`Telephone (TEL): ${stats.hasTel} (${(stats.hasTel / cardCount * 100).toFixed(1)}%)`);
console.log(`WhatsApp ID (waid): ${stats.hasWaid} (${(stats.hasWaid / cardCount * 100).toFixed(1)}%)`);
console.log(`Organization (ORG): ${stats.hasOrg} (${(stats.hasOrg / cardCount * 100).toFixed(1)}%)`);
console.log(`Email (EMAIL): ${stats.hasEmail} (${(stats.hasEmail / cardCount * 100).toFixed(1)}%)`);

// Sample of Organization names to see if they are useful or just duplicates of names
console.log('\n--- Sample ORGs (first 10 unique) ---');
const orgs = new Set<string>();
for (const line of lines) {
    if (line.startsWith('ORG:')) {
        const org = line.substring(4).replace(';', '').trim();
        if (org && !orgs.has(org)) {
            orgs.add(org);
            if (orgs.size >= 10) break;
        }
    }
}
console.log([...orgs].join(', '));
