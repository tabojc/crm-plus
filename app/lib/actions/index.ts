'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type QuoteItemInput = {
    product_id?: string
    product_name: string
    quantity: number
    unit_price: number
}

export type CreateQuoteInput = {
    contact_id: string
    items: QuoteItemInput[]
}

export type ContactInput = {
    full_name: string
    organization?: string
    waid?: string
    tags?: string[]
}

export async function searchContacts(query: string, tag?: string) {
    const supabase = await createClient()

    let dbQuery = supabase
        .from('contacts')
        .select('id, full_name, organization, waid, tags')
        .limit(20)

    if (query) {
        dbQuery = dbQuery.or(`full_name.ilike.%${query}%,organization.ilike.%${query}%`)
    }

    if (tag) {
        dbQuery = dbQuery.contains('tags', [tag])
    }

    const { data, error } = await dbQuery

    if (error) {
        console.error('Error searching contacts:', error)
        return []
    }

    return data
}

export async function searchProducts(query: string) {
    const supabase = await createClient()

    // if (!query) return [] // Removed to allow default listing

    let dbQuery = supabase
        .from('products')
        .select('id, name, price_list, price_min, price_offer, image_url')
        .limit(20)

    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    const { data, error } = await dbQuery

    if (error) {
        console.error('Error searching products:', error)
        return []
    }

    return data
}

export async function createQuote(input: CreateQuoteInput) {
    const supabase = await createClient()
    const { contact_id, items } = input

    // Calculate total on server side
    const total = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)

    // 1. Create Quote
    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
            contact_id,
            total,
            status: 'draft'
        })
        .select()
        .single()

    if (quoteError || !quote) {
        console.error('Error creating quote:', quoteError)
        return { success: false, error: 'Failed to create quote header' }
    }

    // 2. Create Items
    const quoteItems = items.map(item => ({
        quote_id: quote.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price
    }))

    const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems)

    if (itemsError) {
        console.error('Error creating quote items:', itemsError)
        // ideally we should rollback here, but for now simple error return
        return { success: false, error: 'Failed to create quote items' }
    }

    revalidatePath('/dashboard/quotes')
    return { success: true, quoteId: quote.id }
}

export async function getQuotes() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quotes')
        .select(`
      *,
      contacts (full_name, organization)
    `)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching quotes:', error)
        return []
    }

    return data
}
export async function getQuote(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quotes')
        .select(`
            *,
            contacts (full_name, organization),
            quote_items (
                id, product_name, quantity, unit_price, total
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching quote:', error)
        return null
    }

    return data
}

export async function getContact(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching contact:', error)
        return null
    }

    return data
}

export async function createContact(input: ContactInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contacts')
        .insert(input)
        .select()
        .single()

    if (error) {
        console.error('Error creating contact:', error)
        return { success: false, error: 'Error al crear contacto' }
    }

    revalidatePath('/dashboard/contacts')
    return { success: true, contact: data }
}

export async function updateContact(id: string, input: ContactInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('contacts')
        .update(input)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating contact:', error)
        return { success: false, error: 'Error al actualizar contacto' }
    }

    revalidatePath('/dashboard/contacts')
    return { success: true, contact: data }
}

export async function deleteContact(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting contact:', error)
        return { success: false, error: 'Error al eliminar contacto' }
    }

    revalidatePath('/dashboard/contacts')
    return { success: true }
}
