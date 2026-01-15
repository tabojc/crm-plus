
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } })

async function syncMissingContacts() {
    console.log('--- Syncing Missing Contacts to Production ---')

    // 1. Load Local JSON (The Source of Truth)
    const jsonPath = path.join(process.cwd(), 'docs', 'contacts_clean.json')
    const rawData = fs.readFileSync(jsonPath, 'utf-8')
    const allContacts = JSON.parse(rawData)

    console.log(`Source (Local JSON): ${allContacts.length} contacts.`)

    // 2. Fetch All Production IDs/WAIDs to comparison
    let prodMap = new Set()
    let page = 0
    const pageSize = 1000 // Safer limit for Supabase
    let hasMore = true
    let prodCount = 0

    console.log('Fetching Production Index...')

    while (hasMore) {
        const { data, error } = await supabase
            .from('contacts')
            .select('waid, full_name') // optimization: fetching only distinct keys
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error('Error fetching prod:', error)
            return
        }

        data.forEach(c => {
            if (c.waid) prodMap.add(`WA:${c.waid}`)
            else prodMap.add(`NM:${c.full_name}`)
        })
        prodCount += data.length

        // Standard pagination: If we got less than we asked, we are at the end.
        if (data.length < pageSize) hasMore = false
        page++
        process.stdout.write('.')
    }

    console.log(`\nProduction: ${prodCount} contacts.`)

    // 3. Identify Missing
    const toInsert = []

    for (const contact of allContacts) {
        const keyWaid = contact.waid ? `WA:${contact.waid}` : null
        const keyName = `NM:${contact.full_name}`

        let exists = false
        if (keyWaid && prodMap.has(keyWaid)) exists = true
        if (!exists && prodMap.has(keyName)) exists = true

        if (!exists) {
            toInsert.push(contact)
        }
    }

    console.log(`Found ${toInsert.length} contacts in Local that are MISSING in Production.`)

    if (toInsert.length === 0) {
        console.log('✅ Synchronized! No missing contacts.')
        return
    }

    // 4. Insert Missing
    console.log('Inserting missing contacts...')
    const batchSize = 100
    for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize)
        const { error } = await supabase.from('contacts').insert(batch)
        if (error) {
            console.error(`Error inserting batch ${i}:`, error.message)
        } else {
            // console.log(`Inserted ${i} - ${Math.min(i+batchSize, toInsert.length)}`)
            process.stdout.write('+')
        }
    }

    console.log('\n✅ Sync Complete.')
}

syncMissingContacts()
