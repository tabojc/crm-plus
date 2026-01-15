
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

async function createUser() {
    const email = 'admin@crmplus.com'
    const password = 'password123'

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (error) {
        if (error.message.includes('already has been registered')) {
            console.log('✅ User already exists.')
            console.log(`📧 Email: ${email}`)
            console.log(`🔑 Password: ${password}`)
        } else {
            console.error('❌ Error creating user:', error.message)
        }
    } else {
        console.log('✅ User created successfully!')
        console.log(`📧 Email: ${email}`)
        console.log(`🔑 Password: ${password}`)
    }
}

createUser()
