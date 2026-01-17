
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
    console.log('Checking remote schema...')

    // Check if quotes table exists by selecting from it (limit 0)
    const { data, error } = await supabase
        .from('quotes')
        .select('id, number')
        .limit(1)

    if (error) {
        if (error.code === '42P01') { // undefined_table
            console.log('RESULT: Quotes table DOES NOT exist.')
        } else if (error.code === '42703') { // undefined_column
            console.log('RESULT: Quotes table EXISTS but column missing (likely "number").')
            console.log('Error details:', error.message)
        } else {
            console.log('RESULT: Error checking quotes table:', error.message)
            // If we get "search_path" error or similar, it might exist but we assume it exists if it's not 42P01 for now.
            // Actually RLS might block us? Service role bypasses RLS.
        }
    } else {
        console.log('RESULT: Quotes table EXISTS and is accessible.')
        console.log('Data sample:', data)
    }
}

checkSchema()
