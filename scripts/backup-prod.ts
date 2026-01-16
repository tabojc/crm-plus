
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables in .env.production')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
})

async function fetchTable(tableName: string) {
    console.log(`Fetching ${tableName}...`)
    let allData: any[] = []
    let page = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error(`Error fetching ${tableName}:`, error)
            throw error
        }

        allData = [...allData, ...data]
        if (data.length < pageSize) hasMore = false
        page++
        process.stdout.write('.')
    }
    console.log(`\n✅ Fetched ${allData.length} from ${tableName}`)
    return allData
}

async function backup() {
    console.log('--- Starting Production Backup ---')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backups')

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir)
    }


    const safeFetch = async (table: string) => {
        try {
            return await fetchTable(table)
        } catch (e) {
            console.warn(`⚠️ Warning: Could not backup table '${table}'. It might not exist or verify permissions.`)
            return []
        }
    }

    try {
        const backupData = {
            timestamp,
            contacts: await safeFetch('contacts'),
            products: await safeFetch('products'),
            quotes: await safeFetch('quotes'),
            quote_items: await safeFetch('quote_items')
        }

        const filename = `prod_backup_${timestamp}.json`
        const filePath = path.join(backupDir, filename)

        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))
        console.log(`\n🎉 Backup saved to: ${filePath}`)
        console.log(`Total size: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB`)

    } catch (error) {
        console.error('Backup failed:', error)
    }
}

backup()
