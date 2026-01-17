
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

async function checkColumn() {
    console.log('🔍 Checking if price_type exists in quote_items...')

    // Try to select the column from one row
    const { data, error } = await supabase
        .from('quote_items')
        .select('price_type')
        .limit(1)

    if (error) {
        if (error.code === '42703') { // Undefined column
            console.log('❌ Column "price_type" does NOT exist.')
        } else {
            console.error('❌ Error checking column:', error)
        }
    } else {
        console.log('✅ Column "price_type" exists.')
    }
}

checkColumn()
