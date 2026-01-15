
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

async function checkData() {
    const { count: contactCount, error: contactError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })

    if (contactError) {
        console.error('Error checking contacts:', contactError.message)
    } else {
        console.log(`📊 Current Contacts: ${contactCount}`)
    }

    const { count: productCount, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    if (productError) {
        console.error('Error checking products:', productError.message)
    } else {
        console.log(`📊 Current Products: ${productCount}`)
    }
}

checkData()
