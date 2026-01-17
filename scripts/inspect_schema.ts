
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

async function checkSchema() {
    console.log('🔍 Checking schemas...')

    // Check quotes for 'number' or similar
    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .limit(1)

    if (quote && quote.length > 0) {
        console.log('Quote keys:', Object.keys(quote[0]))
    } else {
        console.log('No quotes found to inspect keys.')
    }

    // Check contacts for phone, address
    const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .limit(1)

    if (contact && contact.length > 0) {
        console.log('Contact keys:', Object.keys(contact[0]))
    } else {
        console.log('No contacts found to inspect keys.')
    }
}

checkSchema()
