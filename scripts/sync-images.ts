
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Helper to load env
const loadEnv = (filename: string) => {
    const filePath = path.join(process.cwd(), filename)
    return dotenv.parse(fs.readFileSync(filePath))
}

const run = async () => {
    console.log('--- Syncing Images from Production to Local ---')

    // 1. Setup Production Client
    const prodEnv = loadEnv('.env.production')
    const prodSupabase = createClient(
        prodEnv.NEXT_PUBLIC_SUPABASE_URL,
        prodEnv.SUPABASE_SERVICE_ROLE_KEY
    )

    // 2. Setup Local Client
    const localEnv = loadEnv('.env.local')
    const localSupabase = createClient(
        localEnv.NEXT_PUBLIC_SUPABASE_URL,
        localEnv.SUPABASE_SERVICE_ROLE_KEY
    )

    // 3. Fetch Products with Images from Production
    console.log('Fetching products from Production...')
    const { data: prodProducts, error: prodError } = await prodSupabase
        .from('products')
        .select('name, image_url')
        .not('image_url', 'is', null)

    if (prodError) {
        console.error('Error fetching production products:', prodError)
        return
    }

    console.log(`Found ${prodProducts.length} products with images in Production.`)

    // 4. Update Local Products
    console.log('Updating Local Database...')
    let updatedCount = 0
    let errorCount = 0

    // Process in chunks to be nice
    for (const prodProduct of prodProducts) {
        const { error } = await localSupabase
            .from('products')
            .update({ image_url: prodProduct.image_url })
            .eq('name', prodProduct.name) // Matching by name as ID might differ

        if (error) {
            console.error(`Failed to update ${prodProduct.name}:`, error.message)
            errorCount++
        } else {
            updatedCount++
        }
    }

    console.log(`Sync Complete. Updated: ${updatedCount}, Errors: ${errorCount}`)
}

run()
