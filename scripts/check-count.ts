
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } })

async function checkCount() {
    const { count, error } = await supabase.from('contacts').select('*', { count: 'exact', head: true })
    if (error) console.error(error)
    else console.log(`Production Total: ${count}`)
}

checkCount()
