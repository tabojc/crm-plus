'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { QuoteRepository } from '../repositories/quote-repository'
import { CreateQuoteInput } from '../types'

export async function getQuotes() {
    const supabase = await createClient()
    const repo = new QuoteRepository(supabase)
    return await repo.findAll()
}

export async function getQuotesCount() {
    const supabase = await createClient()
    const repo = new QuoteRepository(supabase)
    return await repo.count()
}

export async function getQuote(id: string) {
    const supabase = await createClient()
    const repo = new QuoteRepository(supabase)
    return await repo.findById(id)
}

export async function createQuote(input: CreateQuoteInput) {
    const supabase = await createClient()
    const repo = new QuoteRepository(supabase)
    const { contact_id, items } = input

    // Business Logic: Calculate total with 16% Tax
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)
    const tax = subtotal * 0.16
    const total = subtotal + tax

    try {
        // 1. Create Header
        const quote = await repo.createHeader({
            contact_id,
            total,
            status: 'draft'
        })

        // 2. Prepare and Create Items
        const quoteItems = items.map(item => ({
            quote_id: quote.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.quantity * item.unit_price,
            price_type: item.price_type || 1 // Default to List Price
        }))

        await repo.createItems(quoteItems)

        revalidatePath('/dashboard/quotes')
        return { success: true, quoteId: quote.id }

    } catch (error) {
        console.error('Action createQuote error:', error)
        return { success: false, error: 'Failed to create quote' }
    }
}
