'use server'

import { createClient } from '@/lib/supabase/server'
import { ProductRepository } from '../repositories/product-repository'

export async function searchProducts(query: string) {
    const supabase = await createClient()
    const repo = new ProductRepository(supabase)
    return await repo.search(query)
}
