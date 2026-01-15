
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load envs
const envLocal = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.local')))
const envProd = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.production')))

const localClient = createClient(envLocal.NEXT_PUBLIC_SUPABASE_URL!, envLocal.SUPABASE_SERVICE_ROLE_KEY!)
const prodClient = createClient(envProd.NEXT_PUBLIC_SUPABASE_URL!, envProd.SUPABASE_SERVICE_ROLE_KEY!)

async function analyze(client: any, label: string) {
    console.log(`\n🔍 Analyzing ${label}...`)

    // 1. Fetch Candidates (name is "." OR string empty/null) AND (organization is NOT null)
    // Supabase filtering on "OR" with specifics is tricky. Let's fetch where org is not null and filter in JS for safety/speed since we don't expect millions.
    // actually we can use .or()

    // However, simplest is:
    // select * from contacts where organization is not null and organization != ''

    let candidates = []
    let page = 0
    let pageSize = 1000
    let hasMore = true

    while (hasMore) {
        const { data, error } = await client
            .from('contacts')
            .select('id, full_name, organization')
            .neq('organization', null) // Optim: Only where org exists
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) { console.error(error); return }

        // Filter in JS for precision
        const badNames = data.filter(c => {
            const name = (c.full_name || '').trim()
            return name === '.' || name === ''
        })

        candidates = [...candidates, ...badNames]

        if (data.length < pageSize) hasMore = false
        page++
    }

    console.log(`Found ${candidates.length} candidates in ${label}.`)
    if (candidates.length > 0) {
        console.log('Sample (first 5):')
        candidates.slice(0, 5).forEach(c => console.log(`[${c.id}] Name: '${c.full_name}' -> Org: '${c.organization}'`))
    }
}

async function main() {
    await analyze(localClient, 'LOCAL')
    await analyze(prodClient, 'PROD')
}

main()
