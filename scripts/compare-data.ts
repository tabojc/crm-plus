
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// 1. Load ENVs
const envLocal = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.local')))
const envProd = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.production')))

// 2. Init Clients
const localClient = createClient(
    envLocal.NEXT_PUBLIC_SUPABASE_URL!,
    envLocal.SUPABASE_SERVICE_ROLE_KEY!
)

const prodClient = createClient(
    envProd.NEXT_PUBLIC_SUPABASE_URL!,
    envProd.SUPABASE_SERVICE_ROLE_KEY!
)

async function getAllContacts(client: any, label: string) {
    let allContacts: any[] = []
    let page = 0
    const pageSize = 1000
    let hasMore = true

    console.log(`📥 Fetching ${label} contacts...`)

    while (hasMore) {
        const { data, error } = await client
            .from('contacts')
            .select('id, full_name, waid, phone')
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error(`❌ Error fetching ${label}:`, error.message)
            return []
        }

        if (data.length < pageSize) hasMore = false
        allContacts = [...allContacts, ...data]
        process.stdout.write('.')
        page++
    }
    console.log(`\n✅ Fetched ${allContacts.length} from ${label}`)
    return allContacts
}

async function compare() {
    const localContacts = await getAllContacts(localClient, 'LOCAL')
    const prodContacts = await getAllContacts(prodClient, 'PROD')

    console.log('--- Comparison Analysis ---')

    // 1. Check Missing Phones in Prod
    const prodMissingPhone = prodContacts.filter(c => !c.phone)
    console.log(`⚠️ Contacts missing phone in PROD: ${prodMissingPhone.length}`)

    // 2. Cross-reference
    let recoveredCount = 0
    let stillMissingCount = 0

    console.log('\n--- Detail of Missing Phones ---')

    for (const pContact of prodMissingPhone) {
        // Try to find match in Local by WAID matches or Name matches
        const localMatch = localContacts.find(l => {
            if (pContact.waid && l.waid === pContact.waid) return true
            if (pContact.full_name === l.full_name) return true
            return false
        })

        if (localMatch && localMatch.phone) {
            console.log(`[RECOVERABLE] ${pContact.full_name} | Prod Phone: NULL | Local Phone: ${localMatch.phone}`)
            recoveredCount++
        } else {
            // console.log(`[MISSING BOTH] ${pContact.full_name}`)
            stillMissingCount++
        }
    }

    console.log('---------------------------------------------------')
    console.log(`Total Missing in Prod: ${prodMissingPhone.length}`)
    console.log(`Recoverable from Local: ${recoveredCount}`)
    console.log(`Truly Missing (Also missing in Local): ${stillMissingCount}`)

    const percentage = ((prodMissingPhone.length / prodContacts.length) * 100).toFixed(2)
    console.log(`Missing Rate in Prod: ${percentage}%`)
}

compare()
