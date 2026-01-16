
import { SupabaseClient } from '@supabase/supabase-js'
import { ContactInput } from '@/app/lib/types'

export class ContactRepository {
    constructor(private supabase: SupabaseClient) { }

    async search(query: string, tag?: string) {
        let dbQuery = this.supabase
            .from('contacts')
            .select('id, full_name, organization, waid, tags, phone')
            .order('created_at', { ascending: false })
            .limit(20)

        if (query) {
            dbQuery = dbQuery.or(`full_name.ilike.%${query}%,organization.ilike.%${query}%`)
        }

        if (tag) {
            dbQuery = dbQuery.contains('tags', [tag])
        }

        const { data, error } = await dbQuery

        if (error) {
            console.error('ContactRepository.search error:', error)
            return []
        }

        return data
    }

    async findById(id: string) {
        const { data, error } = await this.supabase
            .from('contacts')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('ContactRepository.findById error:', error)
            return null
        }
        return data
    }

    async create(input: ContactInput) {
        const { data, error } = await this.supabase
            .from('contacts')
            .insert(input)
            .select()
            .single()

        if (error) {
            console.error('ContactRepository.create error:', error)
            throw new Error('Error creating contact')
        }
        return data
    }

    async update(id: string, input: ContactInput) {
        const { data, error } = await this.supabase
            .from('contacts')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('ContactRepository.update error:', error)
            throw new Error('Error updating contact')
        }
        return data
    }

    async delete(id: string) {
        const { error } = await this.supabase
            .from('contacts')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('ContactRepository.delete error:', error)
            throw new Error('Error deleting contact')
        }
    }

    async count() {
        const { count, error } = await this.supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('ContactRepository.count error:', error)
            return 0
        }
        return count || 0
    }
}
