
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

async function fixQuoteItems() {
    console.log('🔍 Scanning for quote items with missing product_id...')

    // 1. Get items with potential issues (missing product_id OR null numbers)
    const { data: items, error } = await supabase
        .from('quote_items')
        .select('*')
        .or('product_id.is.null,unit_price.is.null,total.is.null,quantity.is.null')

    if (error) {
        console.error('❌ Error fetching items:', error)
        return
    }

    if (!items || items.length === 0) {
        console.log('✅ No items found with issues.')
        return
    }

    console.log(`Found ${items.length} items to fix.`)

    let fixedCount = 0
    let failedCount = 0

    // 2. Process each item
    for (const item of items) {
        // Try to find product by name
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id')
            .eq('name', item.product_name)
            .single()

        if (productError || !product) {
            console.log(`⚠️ Could not find product for item "${item.product_name}" (ID: ${item.id})`)
            failedCount++
            continue
        }

        // Update item
        const { error: updateError } = await supabase
            .from('quote_items')
            .update({ product_id: product.id })
            .eq('id', item.id)

        if (updateError) {
            console.error(`❌ Failed to update item ${item.id}:`, updateError)
            failedCount++
        } else {
            console.log(`✅ Fixed item ${item.id} -> Product ID: ${product.id}`)
            fixedCount++
        }
    }

    console.log('--------------------------------------------------')
    console.log(`🎉 Finished!`)
    console.log(`✅ Fixed: ${fixedCount}`)
    console.log(`⚠️ Failed: ${failedCount}`)
}

fixQuoteItems()
