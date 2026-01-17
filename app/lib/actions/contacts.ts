'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ContactRepository } from '../repositories/contact-repository'
import { ContactInput } from '../types'

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
