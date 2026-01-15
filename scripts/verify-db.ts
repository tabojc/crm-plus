
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

async function verify() {
    const { data, error } = await supabase
        .from('quotes')
        .select('id')
        .limit(1)

    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows, which is fine. Error would be 42P01 if table missing
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
            console.log('❌ Table "quotes" does not exist.')
        } else {
            console.log('✅ Table "quotes" exists (or accessible).')
        }
    } else {
        console.log('✅ Table "quotes" exists.')
    }

    const { data: items, error: itemsError } = await supabase
        .from('quote_items')
        .select('id')
        .limit(1)

    if (itemsError && itemsError.code === '42P01') {
        console.log('❌ Table "quote_items" does not exist.')
    } else {
        console.log('✅ Table "quote_items" exists.')
    }
}

verify()
