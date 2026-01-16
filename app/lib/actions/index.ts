'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ContactRepository } from '../repositories/contact-repository'
import { ProductRepository } from '../repositories/product-repository'
import { QuoteRepository } from '../repositories/quote-repository'
import { CreateQuoteInput, ContactInput } from '../types'

// Re-export types for frontend usage
// export * from '../types'

// --- Contacts Actions ---

export async function searchContacts(query: string, tag?: string) {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)
    return await repo.search(query, tag)
}

export async function getContact(id: string) {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)
    return await repo.findById(id)
}

export async function createContact(input: ContactInput) {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)

    try {
        const contact = await repo.create(input)
        revalidatePath('/dashboard/contacts')
        return { success: true, contact }
    } catch (e) {
        return { success: false, error: 'Error al crear contacto' }
    }
}

export async function updateContact(id: string, input: ContactInput) {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)

    try {
        const contact = await repo.update(id, input)
        revalidatePath('/dashboard/contacts')
        return { success: true, contact }
    } catch (e) {
        return { success: false, error: 'Error al actualizar contacto' }
    }
}

export async function deleteContact(id: string) {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)

    try {
        await repo.delete(id)
        revalidatePath('/dashboard/contacts')
        return { success: true }
    } catch (e) {
        return { success: false, error: 'Error al eliminar contacto' }
    }
}

export async function getContactsCount() {
    const supabase = await createClient()
    const repo = new ContactRepository(supabase)
    return await repo.count()
}

// --- Product Actions ---

export async function searchProducts(query: string) {
    const supabase = await createClient()
    const repo = new ProductRepository(supabase)
    return await repo.search(query)
}

// --- Quote Actions ---

export async function getQuotes() {
    const supabase = await createClient()
    const repo = new QuoteRepository(supabase)
    return await repo.findAll()
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

    // Business Logic: Calculate total
    const total = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)

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
            total: item.quantity * item.unit_price
        }))

        await repo.createItems(quoteItems)

        revalidatePath('/dashboard/quotes')
        return { success: true, quoteId: quote.id }

    } catch (error) {
        console.error('Action createQuote error:', error)
        return { success: false, error: 'Failed to create quote' }
    }
}

