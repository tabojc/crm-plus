
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } })

async function analyzeDuplicates() {
    console.log('--- Analyzing Duplicates in Production DB ---')

    // 1. Fetch ALL Contacts
    let allContacts: any[] = []
    let page = 0
    const pageSize = 1000
    let hasMore = true

    console.log('Fetching all contacts...')

    while (hasMore) {
        const { data, error } = await supabase
            .from('contacts')
            .select('id, full_name, waid, phone')
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error('Error fetching prod:', error)
            return
        }

        allContacts = [...allContacts, ...data]
        if (data.length < pageSize) hasMore = false
        page++
        process.stdout.write('.')
    }
    console.log(`\nTotal Fetched: ${allContacts.length}`)

    // 2. Map by WAID
    const waidMap = new Map<string, any[]>()
    const nameMap = new Map<string, any[]>() // Only for those without WAID? Or check all? Let's check all for Name dupes

    allContacts.forEach(c => {
        if (c.waid) {
            const key = c.waid
            if (!waidMap.has(key)) waidMap.set(key, [])
            waidMap.get(key)?.push(c)
        }

        if (c.full_name) {
            const key = c.full_name.trim().toLowerCase()
            if (!nameMap.has(key)) nameMap.set(key, [])
            nameMap.get(key)?.push(c)
        }
    })

    // 3. Report WAID Duplicates (Critical)
    console.log('\n--- WAID Duplicates (Critical) ---')
    let waidDupCount = 0
    waidMap.forEach((list, waid) => {
        if (list.length > 1) {
            console.log(`WAID: ${waid} -> ${list.length} records`)
            list.forEach(c => console.log(`   - [${c.id}] ${c.full_name}`))
            waidDupCount++
        }
    })

    if (waidDupCount === 0) console.log('✅ No WAID duplicates found.')

    // 4. Report Name Duplicates (Advisory)
    console.log('\n--- Name Duplicates (Advisory) ---')
    let nameDupCount = 0
    nameMap.forEach((list, name) => {
        if (list.length > 1) {
            // Filter out if they share the same WAID (already covered)
            // If Waids differ or are null, it's interesting
            const distinctWaids = new Set(list.map(c => c.waid).filter(Boolean))

            if (distinctWaids.size > 1) {
                console.log(`Name: "${list[0].full_name}" -> Different WAIDs: ${Array.from(distinctWaids).join(', ')}`)
                nameDupCount++
            } else if (list.some(c => !c.waid)) {
                // Check if it's purely lack of WAID
                console.log(`Name: "${list[0].full_name}" -> Repetitions (some missing WAID): ${list.length}`)
                nameDupCount++
            }
        }
    })

    console.log(`\nFound matches for ${nameDupCount} names that suggest duplication.`)
}

analyzeDuplicates()
