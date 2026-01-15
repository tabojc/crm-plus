
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load envs
const envLocal = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.local')))
const envProd = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.production')))

const localClient = createClient(envLocal.NEXT_PUBLIC_SUPABASE_URL!, envLocal.SUPABASE_SERVICE_ROLE_KEY!)
const prodClient = createClient(envProd.NEXT_PUBLIC_SUPABASE_URL!, envProd.SUPABASE_SERVICE_ROLE_KEY!)

async function migrate(client: any, label: string) {
    console.log(`\n🚀 Migrating ${label}...`)

    // 1. Fetch Candidates again
    let candidates = []
    let page = 0
    let pageSize = 1000
    let hasMore = true

    while (hasMore) {
        const { data, error } = await client
            .from('contacts')
            .select('id, full_name, organization')
            .neq('organization', null)
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) { console.error(error); return }

        const badNames = data.filter(c => {
            const name = (c.full_name || '').trim()
            return name === '.' || name === ''
        })

        candidates = [...candidates, ...badNames]
        if (data.length < pageSize) hasMore = false
        page++
    }

    if (candidates.length === 0) {
        console.log('No candidates found to migrate.')
        return
    }

    console.log(`Migrating ${candidates.length} records...`)

    // 2. Update
    for (const c of candidates) {
        const newName = c.organization.trim()
        console.log(`[${c.id}] Renaming "${c.full_name}" -> "${newName}"`)

        const { error } = await client
            .from('contacts')
            .update({ full_name: newName }) // Ideally clear Org? Or keep it? User said "tomemos la informacion de la org como nombre". Usually implies copy.
            .eq('id', c.id)

        if (error) console.error(`Error updating ${c.id}:`, error.message)
        else process.stdout.write('✅ ')
    }
    console.log('\nDone.')
}

async function main() {
    await migrate(localClient, 'LOCAL')
    await migrate(prodClient, 'PROD')
}

main()
