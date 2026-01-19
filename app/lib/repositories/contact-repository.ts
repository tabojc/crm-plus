
import { SupabaseClient } from '@supabase/supabase-js'
import { ContactInput } from '@/app/lib/types'

export class ContactRepository {
    constructor(private supabase: SupabaseClient) { }

    async search(query: string, tag?: string, page: number = 1, pageSize: number = 20) {
        let dbQuery = this.supabase
            .from('contacts')
            .select('id, full_name, organization, waid, tags, phone', { count: 'exact' })
            .order('created_at', { ascending: false })
            .order('full_name', { ascending: true })

        if (query) {
            dbQuery = dbQuery.or(`full_name.ilike.%${query}%,organization.ilike.%${query}%`)
        }

        if (tag) {
            dbQuery = dbQuery.contains('tags', [tag])
        }

        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await dbQuery.range(from, to)

        if (error) {
            console.error('ContactRepository.search error:', error)
            return { data: [], count: 0 }
        }

        return { data: data || [], count: count || 0 }
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
