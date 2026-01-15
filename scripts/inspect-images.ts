
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load .env.local to target local DB
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkImages() {
    const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .not('image_url', 'is', null)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log(`Products with Images: ${count}`)
}

checkImages()
