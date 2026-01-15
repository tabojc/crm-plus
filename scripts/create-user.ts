
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
            console.log('⚠️ User already exists. Attempting to update/confirm...')

            // 1. List users to find the ID
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
            if (listError) {
                console.error('❌ Error listing users:', listError.message)
                return
            }

            const existingUser = users.find(u => u.email === email)
            if (!existingUser) {
                console.error('❌ Could not find user in list despite "already registered" error.')
                return
            }

            // 2. Update user (Confirm valid, Set Password)
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                existingUser.id,
                {
                    password: password,
                    email_confirm: true,
                    user_metadata: { email_verified: true }
                }
            )

            if (updateError) {
                console.error('❌ Error updating user:', updateError.message)
            } else {
                console.log('✅ User updated successfully!')
                console.log('Status: Confirmed & Password Reset')
                console.log(`📧 Email: ${email}`)
                console.log(`🔑 Password: ${password}`)
            }

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
