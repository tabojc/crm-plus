
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load envs
const envLocal = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.local')))
const envProd = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.production')))

const localClient = createClient(envLocal.NEXT_PUBLIC_SUPABASE_URL!, envLocal.SUPABASE_SERVICE_ROLE_KEY!)
const prodClient = createClient(envProd.NEXT_PUBLIC_SUPABASE_URL!, envProd.SUPABASE_SERVICE_ROLE_KEY!)

async function fetchAll(client: any, label: string) {
    let all: any[] = []
    let page = 0
    const pageSize = 1000
    let hasMore = true

    console.log(`Fetching ${label}...`)
    while (hasMore) {
        const { data, error } = await client
            .from('contacts')
            .select('id, waid, full_name, phone') // compare these fields
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) { console.error(error); return [] }
        all = [...all, ...data]
        if (data.length < pageSize) hasMore = false
        page++
        process.stdout.write('.')
    }
    console.log(`\nFetched ${all.length} from ${label}`)
    return all
}

async function deepCompare() {
    const localContacts = await fetchAll(localClient, 'LOCAL')
    const prodContacts = await fetchAll(prodClient, 'PROD')

    console.log('\n--- Deep Comparison Analysis ---')

    // Index by WAID (primary) and Name (secondary)
    const localMap = new Map<string, any>()
    localContacts.forEach(c => {
        const key = c.waid ? `WA:${c.waid}` : `NM:${c.full_name}`
        localMap.set(key, c)
    })

    const prodMap = new Map<string, any>()
    prodContacts.forEach(c => {
        const key = c.waid ? `WA:${c.waid}` : `NM:${c.full_name}`
        prodMap.set(key, c)
    })

    // 1. Extra in Prod
    const extraInProd: any[] = []
    prodContacts.forEach(c => {
        const key = c.waid ? `WA:${c.waid}` : `NM:${c.full_name}`
        if (!localMap.has(key)) extraInProd.push(c)
    })

    // 2. Extra in Local (Should be 0)
    const extraInLocal: any[] = []
    localContacts.forEach(c => {
        const key = c.waid ? `WA:${c.waid}` : `NM:${c.full_name}`
        if (!prodMap.has(key)) extraInLocal.push(c)
    })

    // 3. Mismatches (Same key, different content)
    let mismatches = 0
    prodContacts.forEach(p => {
        const key = p.waid ? `WA:${p.waid}` : `NM:${p.full_name}`
        const l = localMap.get(key)
        if (l) {
            // Compare Phone
            const pPhone = (p.phone || '').trim()
            const lPhone = (l.phone || '').trim()
            if (pPhone !== lPhone) {
                // Ignore if both are effectively empty
                if (!pPhone && !lPhone) return
                console.log(`Mismatch [${p.full_name}]: ProdPhone='${pPhone}' vs LocalPhone='${lPhone}'`)
                mismatches++
            }
        }
    })

    console.log('\n--- Results ---')
    console.log(`Extra in PROD: ${extraInProd.length}`)
    if (extraInProd.length > 0) {
        console.log('Sample Extra Prod:')
        extraInProd.slice(0, 5).forEach(c => console.log(`   - ${c.full_name} (WAID: ${c.waid || 'None'})`))
    }

    console.log(`Extra in LOCAL: ${extraInLocal.length}`)
    if (extraInLocal.length > 0) {
        console.log('Sample Extra Local:')
        extraInLocal.slice(0, 5).forEach(c => console.log(`   - ${c.full_name} (WAID: ${c.waid || 'None'})`))
    }

    console.log(`Content Mismatches (Phone): ${mismatches}`)
}

deepCompare()
