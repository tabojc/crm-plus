
import { SupabaseClient } from '@supabase/supabase-js'

export class QuoteRepository {
    constructor(private supabase: SupabaseClient) { }

    async findAll() {
        const { data, error } = await this.supabase
            .from('quotes')
            .select(`
                *,
                contacts (full_name, organization)
            `)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('QuoteRepository.findAll error:', error)
            return []
        }
        return data
    }

    async findById(id: string) {
        const { data, error } = await this.supabase
            .from('quotes')
            .select(`
                *,
                contacts (full_name, organization, phone, address),
                quote_items (
                    id, product_name, quantity, unit_price, total, price_type
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('QuoteRepository.findById error:', error)
            return null
        }
        return data
    }

    async createHeader(input: { contact_id: string; total: number; status: string }) {
        const { data: quote, error: quoteError } = await this.supabase
            .from('quotes')
            .insert(input)
            .select()
            .single()

        if (quoteError || !quote) {
            console.error('QuoteRepository.createHeader error:', quoteError)
            throw new Error('Failed to create quote header')
        }
        return quote
    }

    async createItems(items: any[]) {
        const { error: itemsError } = await this.supabase
            .from('quote_items')
            .insert(items)

        if (itemsError) {
            console.error('QuoteRepository.createItems error:', itemsError)
            throw new Error('Failed to create quote items')
        }
    }

    async count() {
        const { count, error } = await this.supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('QuoteRepository.count error:', error)
            return 0
        }
        return count || 0
    }
}
