
import fs from 'fs';
import path from 'path';

const vcfPath = path.join(process.cwd(), 'docs', '_Luisherr11 y 13.673 contactos más.vcf');
const outputPath = path.join(process.cwd(), 'docs', 'contacts_clean.json');

if (!fs.existsSync(vcfPath)) {
    console.error(`File not found: ${vcfPath}`);
    process.exit(1);
}

const content = fs.readFileSync(vcfPath, 'utf-8');
const lines = content.split(/\r?\n/);

interface Contact {
    full_name: string;
    phone?: string;
    waid?: string;
    organization?: string;
    email?: string;
    tags: string[];
    notes?: string;
}

const contactsMap = new Map<string, Contact>();
let current: Partial<Contact> = {};

console.log('--- Starting Conversion & Deduplication ---');

// Helper to clean WAID (remove non-digits)
const cleanWaid = (raw: string) => raw.replace(/\D/g, '');

for (const line of lines) {
    if (line.startsWith('BEGIN:VCARD')) {
        current = { tags: [] };
    } else if (line.startsWith('END:VCARD')) {
        // Process the card
        // Strategy: Key is WAID (priority) or Name (fallback)
        let key = current.waid ? `WA:${current.waid}` : `NM:${current.full_name}`;

        // Skip empty cards
        if (!current.full_name && !current.waid) continue;

        if (contactsMap.has(key)) {
            // MERGE LOGIC
            const existing = contactsMap.get(key)!;

            // 1. Longest Name Wins
            if (current.full_name && current.full_name.length > existing.full_name.length) {
                existing.full_name = current.full_name;
            }

            // 2. Merge missing fields
            if (!existing.email && current.email) existing.email = current.email;
            if (!existing.organization && current.organization) existing.organization = current.organization;
            if (!existing.phone && current.phone) existing.phone = current.phone;

        } else {
            // NEW ENTRY
            // Ensure name exists
            if (!current.full_name) current.full_name = current.waid || 'Unknown';

            contactsMap.set(key, current as Contact);
        }

    } else {
        // Parsing fields
        if (line.startsWith('FN:')) current.full_name = line.substring(3).trim();
        if (line.startsWith('ORG:')) current.organization = line.substring(4).replace(';', '').trim();
        if (line.startsWith('EMAIL')) {
            const parts = line.split(':');
            if (parts.length > 1) current.email = parts[1].trim();
        }
        if (line.startsWith('TEL')) {
            const waidMatch = line.match(/waid=(\d+)/);
            if (waidMatch) {
                current.waid = waidMatch[1];
            }
            // Grab phone text
            const parts = line.split(':');
            if (parts.length > 1) current.phone = parts[1].trim();
        }
    }
}

const finalContacts = Array.from(contactsMap.values());

fs.writeFileSync(outputPath, JSON.stringify(finalContacts, null, 2));

console.log(`Conversion Complete.`);
console.log(`Processed: ${finalContacts.length} unique contacts.`);
console.log(`Saved to: ${outputPath}`);
