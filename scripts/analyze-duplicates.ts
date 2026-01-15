
import fs from 'fs';
import path from 'path';

const vcfPath = path.join(process.cwd(), 'docs', '_Luisherr11 y 13.673 contactos más.vcf');

if (!fs.existsSync(vcfPath)) {
    console.error(`File not found: ${vcfPath}`);
    process.exit(1);
}

const content = fs.readFileSync(vcfPath, 'utf-8');
const lines = content.split(/\r?\n/);

interface Contact {
    fn?: string;
    waid?: string;
    tel?: string;
    org?: string;
}

let contacts: Contact[] = [];
let currentCard: Contact = {};

console.log('--- Starting Deduplication Analysis ---');

// Parsing Phase
for (const line of lines) {
    if (line.startsWith('BEGIN:VCARD')) {
        currentCard = {};
    } else if (line.startsWith('END:VCARD')) {
        contacts.push(currentCard);
    } else {
        if (line.startsWith('FN:')) currentCard.fn = line.substring(3).trim();
        if (line.startsWith('TEL')) {
            // Prefer waid if available
            const waidMatch = line.match(/waid=(\d+)/);
            if (waidMatch) {
                currentCard.waid = waidMatch[1];
            }
            // Also grab raw number just in case
            const telParts = line.split(':');
            if (telParts.length > 1) {
                currentCard.tel = telParts[1].trim();
            }
        }
    }
}

// Analysis Phase
const totalContacts = contacts.length;
const uniqueWaids = new Map<string, Contact[]>();
const uniqueNamesNoWaid = new Map<string, Contact[]>();
let duplicatesCount = 0;
let contactsWithoutWaid = 0;

contacts.forEach(c => {
    if (c.waid) {
        if (!uniqueWaids.has(c.waid)) {
            uniqueWaids.set(c.waid, []);
        } else {
            duplicatesCount++;
        }
        uniqueWaids.get(c.waid)?.push(c);
    } else {
        contactsWithoutWaid++;
        const key = c.fn || 'UNKNOWN';
        if (!uniqueNamesNoWaid.has(key)) {
            uniqueNamesNoWaid.set(key, []);
        }
        uniqueNamesNoWaid.get(key)?.push(c);
    }
});

// Calculate strict name duplicates for those without WAID
let nameDuplicatesCount = 0;
uniqueNamesNoWaid.forEach((list) => {
    if (list.length > 1) {
        nameDuplicatesCount += (list.length - 1);
    }
});

const estimatedUnique = uniqueWaids.size + uniqueNamesNoWaid.size;

console.log(`Total Records: ${totalContacts}`);
console.log(`----------------------------------------`);
console.log(`Duplicates by WhatsApp ID: ${duplicatesCount}`);
console.log(`Duplicates by Name (No WAID): ${nameDuplicatesCount}`);
console.log(`----------------------------------------`);
console.log(`Unique WhatsApp IDs: ${uniqueWaids.size}`);
console.log(`Unique Names (No WAID): ${uniqueNamesNoWaid.size}`);
console.log(`----------------------------------------`);
console.log(`ESTIMATED REAL CONTACTS: ${estimatedUnique}`);
console.log(`(Reduction of ${totalContacts - estimatedUnique} records)`);

// Show some duplicate examples
console.log('\n--- Duplicate Examples (Same WAID, Different Names?) ---');
let examplesShown = 0;
for (const [waid, list] of uniqueWaids) {
    if (list.length > 1 && examplesShown < 5) {
        const names = list.map(c => c.fn).filter(n => n);
        // Check if names are actually different
        const uniqueNames = new Set(names);
        if (uniqueNames.size > 1) {
            console.log(`WAID ${waid}: ${[...uniqueNames].join(' | ')}`);
            examplesShown++;
        }
    }
}
