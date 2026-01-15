
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Force Local Env
const envPath = path.join(process.cwd(), '.env.local')
const envConfig = dotenv.parse(fs.readFileSync(envPath))

const supabase = createClient(
    envConfig.NEXT_PUBLIC_SUPABASE_URL,
    envConfig.SUPABASE_SERVICE_ROLE_KEY
)

async function restoreImages() {
    console.log('--- Restoring Images from Local Source ---')

    // 1. Ensure Bucket Exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) {
        console.error('Error listing buckets:', bucketError)
        return
    }

    const bucketName = 'products'
    if (!buckets.find(b => b.name === bucketName)) {
        console.log(`Creating bucket: ${bucketName}`)
        const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true })
        if (createError) {
            console.error('Error creating bucket:', createError)
            return
        }
    } else {
        console.log(`Bucket '${bucketName}' exists.`)
    }

    // 2. Read Mapping
    const mappingPath = path.join(process.cwd(), 'docs', 'image_mapping.json')
    if (!fs.existsSync(mappingPath)) {
        console.error('Mapping file not found')
        return
    }
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))
    console.log(`Found ${mapping.length} mappings.`)

    // 3. Upload and Update
    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const item of mapping) {
        const productName = item.product.name
        const imageFile = item.imageFile
        const filePath = path.join(process.cwd(), 'docs', 'extracted_images', imageFile)

        if (!fs.existsSync(filePath)) {
            console.warn(`File missing for ${productName}: ${imageFile}`)
            skipCount++
            continue
        }

        const fileBuffer = fs.readFileSync(filePath)
        const storagePath = `public/${imageFile}`

        // Upload
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileBuffer, {
                contentType: 'image/png', // Assuming PNG based on extraction, check extension if dynamic
                upsert: true
            })

        if (uploadError) {
            console.error(`Upload failed for ${imageFile}:`, uploadError.message)
            errorCount++
            continue
        }

        // Get URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(storagePath)

        // Update DB
        const { error: dbError } = await supabase
            .from('products')
            .update({ image_url: publicUrl })
            .eq('name', productName)

        if (dbError) {
            console.error(`DB Update failed for ${productName}:`, dbError.message)
            errorCount++
        } else {
            console.log(`Restored: ${productName}`)
            successCount++
        }
    }

    console.log(`--- Restore Complete ---`)
    console.log(`Success: ${successCount}`)
    console.log(`Skipped (File Missing): ${skipCount}`)
    console.log(`Errors: ${errorCount}`)
}

restoreImages()
