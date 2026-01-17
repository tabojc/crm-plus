
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBrokenQuotes() {
    console.log('🔍 Checking for quotes with missing contacts...')

    // Fetch quotes with their contacts
    const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
            id,
            contact_id,
            contacts (id, full_name)
        `)

    if (error) {
        console.error('❌ Error fetching quotes:', error)
        return
    }

    let brokenCount = 0

    for (const quote of quotes) {
        if (!quote.contacts) {
            console.log(`⚠️ Quote ${quote.id} has orphaned contact_id: ${quote.contact_id}`)
            brokenCount++
        }
    }

    if (brokenCount === 0) {
        console.log('✅ All quotes have valid contacts.')
    } else {
        console.log(`❌ Found ${brokenCount} orphaned quotes.`)
    }
}

checkBrokenQuotes()
