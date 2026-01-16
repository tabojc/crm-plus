
import { SupabaseClient } from '@supabase/supabase-js'

export class ProductRepository {
    constructor(private supabase: SupabaseClient) { }

    async search(query: string) {
        let dbQuery = this.supabase
            .from('products')
            .select('id, name, price_list, price_min, price_offer, image_url')
            .limit(20)

        if (query) {
            dbQuery = dbQuery.ilike('name', `%${query}%`)
        }

        const { data, error } = await dbQuery

        if (error) {
            console.error('ProductRepository.search error:', error)
            return []
        }

        return data
    }
}
