
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load envs
const envLocal = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.local')))
const envProd = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env.production')))

const localClient = createClient(envLocal.NEXT_PUBLIC_SUPABASE_URL!, envLocal.SUPABASE_SERVICE_ROLE_KEY!)
const prodClient = createClient(envProd.NEXT_PUBLIC_SUPABASE_URL!, envProd.SUPABASE_SERVICE_ROLE_KEY!)

const NAME_QUERY = 'María Mari'

async function debug() {
    console.log(`🔍 inspecting "${NAME_QUERY}"...\n`)

    // 1. Check Local JSON
    const jsonPath = path.join(process.cwd(), 'docs', 'contacts_clean.json')
    const jsonContacts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    const jsonMatches = jsonContacts.filter((c: any) => c.full_name.toLowerCase().includes(NAME_QUERY.toLowerCase()))

    console.log('--- LOCAL JSON (Source) ---')
    jsonMatches.forEach((c: any) => console.log(JSON.stringify(c, null, 2)))
    console.log(`Total in JSON: ${jsonMatches.length}\n`)

    // 2. Check Prod DB
    const { data: prodMatches } = await prodClient
        .from('contacts')
        .select('*')
        .ilike('full_name', `%${NAME_QUERY}%`)

    console.log('--- PROD DATABASE ---')
    prodMatches?.forEach(c => console.log(JSON.stringify(c, null, 2)))
    console.log(`Total in PROD: ${prodMatches?.length}`)

    // 3. Check Local DB
    const { data: localMatches } = await localClient
        .from('contacts')
        .select('*')
        .ilike('full_name', `%${NAME_QUERY}%`)

    console.log('\n--- LOCAL DATABASE ---')
    localMatches?.forEach(c => console.log(JSON.stringify(c, null, 2)))
    console.log(`Total in LOCAL DB: ${localMatches?.length}`)
}

debug()
