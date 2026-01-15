
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables manually since we are running via tsx
// Prioritize .env.production for production deployment
const envProdPath = path.join(process.cwd(), '.env.production');
const envLocalPath = path.join(process.cwd(), '.env.local');

let envConfig;
if (fs.existsSync(envProdPath)) {
    console.log('Loading credentials from .env.production');
    envConfig = dotenv.parse(fs.readFileSync(envProdPath));
} else {
    console.log('Loading credentials from .env.local');
    envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
}

const SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY; // Must use Service Role for bulk writes

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

async function importContacts() {
    const filePath = path.join(process.cwd(), 'docs', 'contacts_clean.json');
    if (!fs.existsSync(filePath)) {
        console.error('Contacts JSON not found');
        return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Creating ${data.length} contacts...`);

    // Upsert in batches of 1000
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error } = await supabase.from('contacts').upsert(batch, { onConflict: 'waid' });
        if (error) {
            console.error(`Error importing contacts batch ${i}:`, error);
        } else {
            console.log(`Imported contacts ${i} to ${Math.min(i + batchSize, data.length)}`);
        }
    }
}

async function importProducts() {
    const filePath = path.join(process.cwd(), 'docs', 'products_clean.json');
    if (!fs.existsSync(filePath)) {
        console.error('Products JSON not found');
        return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Creating ${data.length} products...`);

    const { error } = await supabase.from('products').insert(data);
    if (error) {
        console.error('Error importing products:', error);
    } else {
        console.log('Products imported successfully.');
    }
}

async function main() {
    console.log('--- Starting Import to Supabase ---');
    await importContacts();
    await importProducts();
    console.log('--- Import Finished ---');
}

main();
