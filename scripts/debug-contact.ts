
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables in .env.production')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugContact() {
    const NAME = 'María Marin'
    console.log(`🔍 Searching for "${NAME}" in ${supabaseUrl}...`)

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .ilike('full_name', `%${NAME}%`)

    if (error) {
        console.error('❌ Error fetching contacts:', error.message)
        return
    }

    console.log(`Found ${contacts.length} records matching "${NAME}":`)
    console.log('---------------------------------------------------')

    contacts.forEach(c => {
        console.log(`ID: ${c.id}`)
        console.log(`Name: ${c.full_name}`)
        console.log(`Phone: '${c.phone}' (Type: ${typeof c.phone})`)
        console.log(`WAID: '${c.waid}'`)
        console.log(`Tags: ${c.tags}`)
        console.log('---------------------------------------------------')
    })
}

debugContact()
