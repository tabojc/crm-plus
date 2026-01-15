
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use ANON key for login

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables in .env.production')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const EMAIL = 'aliciaquerales2789@gmail.com'
const PASSWORD = '88a7580b1a71f01a'

async function verifyLogin() {
    console.log(`🔐 Attempting login for ${EMAIL} on ${supabaseUrl}...`)

    const { data, error } = await supabase.auth.signInWithPassword({
        email: EMAIL,
        password: PASSWORD,
    })

    if (error) {
        console.error('❌ Login FAILED:', error.message)
    } else {
        console.log('✅ Login SUCCESSFUL!')
        console.log('User ID:', data.user.id)
        console.log('Access Token:', data.session.access_token.slice(0, 20) + '...')
    }
}

verifyLogin()
