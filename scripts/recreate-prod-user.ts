
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import crypto from 'crypto'

// Load production environment variables
dotenv.config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables in .env.production')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const TARGET_EMAIL = 'aliciaquerales2789@gmail.com'

function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString('hex').slice(0, length)
}

async function recreateUser() {
    console.log(`🔍 Checking if user ${TARGET_EMAIL} exists...`)

    // 1. List users to find the ID (admin.listUsers is safer than searching by email sometimes if search logic is strictly exact)
    // But getUserById requires ID. There isn't a direct "getUserByEmail" in admin API usually, we iterate or use listUsers.
    // Actually, listUsers can take filters but standard client usage often iterates page 1.
    // Let's grab the user list and find.

    // Using listUsers to find the user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('❌ Error listing users:', listError.message)
        return
    }

    const existingUser = users.find(u => u.email === TARGET_EMAIL)

    if (existingUser) {
        console.log(`🗑️ User found (ID: ${existingUser.id}). Deleting...`)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id)
        if (deleteError) {
            console.error('❌ Error deleting user:', deleteError.message)
            return
        }
        console.log('✅ User deleted successfully.')
    } else {
        console.log('ℹ️ User does not exist, proceeding to create.')
    }

    // 2. Create the user with a random password
    const password = generateRandomPassword(16)
    console.log(`🆕 Creating user ${TARGET_EMAIL}...`)

    const { data, error: createError } = await supabase.auth.admin.createUser({
        email: TARGET_EMAIL,
        password: password,
        email_confirm: true, // Verification not required
        user_metadata: {
            full_name: 'Alicia Querales' // Optional but good to have
        }
    })

    if (createError) {
        console.error('❌ Error creating user:', createError.message)
        return
    }

    console.log('\n🎉 User created successfully!')
    console.log('---------------------------------------------------')
    console.log(`📧 Email:    ${TARGET_EMAIL}`)
    console.log(`🔑 Password: ${password}`)
    console.log('---------------------------------------------------')
    console.log('⚠️  Please save this password securely.')
}

recreateUser()
