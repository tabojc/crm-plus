
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

async function checkPhones() {
    console.log(`🔍 Checking contacts in ${supabaseUrl}...`)

    const { data: contacts, error, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .limit(20)

    if (error) {
        console.error('❌ Error fetching contacts:', error.message)
        return
    }

    console.log(`Total Contacts (approx): ${count}`)
    console.log('--- Sample Data (First 20) ---')

    let missingPhoneCount = 0;

    contacts.forEach(c => {
        const hasPhone = !!c.phone
        console.log(`[${c.id}] ${c.full_name} | Phone: ${c.phone || 'MISSING'} | WA: ${c.waid} | Email: ${c.email}`)
        if (!hasPhone) missingPhoneCount++
    })

    console.log('---------------------------------------------------')
    console.log(`Sample of 20: ${20 - missingPhoneCount} have phone, ${missingPhoneCount} are missing phone.`)

    // Check count of all contacts with missing phone
    const { count: missingCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .is('phone', null)

    console.log(`Total contacts with NULL phone: ${missingCount}`)

    const { count: emptyCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('phone', '')

    console.log(`Total contacts with EMPTY STRING phone: ${emptyCount}`)

}

checkPhones()
