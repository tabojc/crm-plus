
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

        console.log('Running migration...')
        await client.query(`
            ALTER TABLE quote_items 
            ADD COLUMN IF NOT EXISTS price_type SMALLINT DEFAULT 1;
            
            COMMENT ON COLUMN quote_items.price_type IS '1=List, 2=Offer, 3=Min';
        `)

        console.log('✅ Migration applied successfully.')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    } finally {
        await client.end()
    }
}

runMigration()
