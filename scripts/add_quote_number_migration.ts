
import { Client } from 'pg'

const DB_URL = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'

async function runMigration() {
    console.log('Connecting to DB...')
    const client = new Client({
        connectionString: DB_URL,
    })

    try {
        await client.connect()
        console.log('✅ Connected.')

        // 1. Add number column to quotes
        console.log('Adding number column to quotes...')
        await client.query(`
            ALTER TABLE quotes 
            ADD COLUMN IF NOT EXISTS "number" SERIAL;
        `)

        // 2. Add address column to contacts
        console.log('Adding address column to contacts...')
        await client.query(`
            ALTER TABLE contacts 
            ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Maracay';
        `)

        console.log('✅ Migration applied successfully.')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    } finally {
        await client.end()
    }
}

runMigration()
