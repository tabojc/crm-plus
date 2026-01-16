
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

async function patchPhones() {
    console.log('--- Patching Missing Phones in Production ---')

    // 1. Load Local JSON (Gold Source)
    const jsonPath = path.join(process.cwd(), 'docs', 'contacts_clean.json')
    const rawData = fs.readFileSync(jsonPath, 'utf-8')
    const allContacts = JSON.parse(rawData)

    console.log(`Loaded ${allContacts.length} contacts from local JSON.`)

    // 2. Fetch Production Contacts with Missing Phones
    // We only care about contacts that have NO phone in DB
    // 2. Fetch Production Contacts with Missing Phones
    // We only care about contacts that have NO phone in DB
    let missingPhonesDB: any[] = []
    let hasMore = true
    let page = 0
    const pageSize = 1000

    console.log('Fetching Prod contacts with missing phones...')

    while (hasMore) {
        const { data, error } = await supabase
            .from('contacts')
            .select('id, full_name, waid, phone')
            .is('phone', null) // Only fetch missing
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error('Error fetching prod:', error)
            return
        }

        missingPhonesDB = [...missingPhonesDB, ...data]
        if (data.length < pageSize) hasMore = false
        page++
    }

    console.log(`Found ${missingPhonesDB.length} contacts in Prod with missing phone.`)

    // 3. Match and Update
    let updateCount = 0
    let updates: any[] = []

    for (const prodContact of missingPhonesDB) {
        // Find match in JSON
        // Strategy: Match by WAID first, then Name
        const match = allContacts.find((c: any) => {
            if (prodContact.waid && c.waid === prodContact.waid) return true
            if (prodContact.full_name === c.full_name) return true
            return false
        })

        if (match && match.phone) {
            // Found a recovery!
            updates.push({
                id: prodContact.id,
                phone: match.phone
            })
            // console.log(`Recovering: ${prodContact.full_name} -> ${match.phone}`)
            updateCount++
        }
    }

    console.log(`Can recover ${updateCount} phone numbers.`)

    if (updateCount === 0) {
        console.log('Nothing to update.')
        return
    }

    // 4. Batch Update
    console.log('Starting Batch Update...')

    for (const update of updates) {
        const { error } = await supabase
            .from('contacts')
            .update({ phone: update.phone })
            .eq('id', update.id)

        if (error) {
            console.error(`Failed to update ${update.id}:`, error.message)
        } else {
            // console.log(`Updated ${update.id}`)
            process.stdout.write('.')
        }
    }

    console.log(`\n✅ Successfully patched ${updateCount} contacts.`)
}

patchPhones()
