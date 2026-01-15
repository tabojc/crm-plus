'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createContact, updateContact } from '@/app/lib/actions'

interface ContactFormProps {
    dict: any
    initialData?: any
    isEdit?: boolean
}

export default function ContactForm({ dict, initialData, isEdit = false }: ContactFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || '',
        organization: initialData?.organization || '',
        waid: initialData?.waid || '',
        tags: initialData?.tags?.join(', ') || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const tagsArray = formData.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)

        const payload = {
            ...formData,
            tags: tagsArray
        }

        let result

        if (isEdit && initialData?.id) {
            result = await updateContact(initialData.id, payload)
        } else {
            result = await createContact(payload)
        }

        if (result.success) {
            router.push('/dashboard/contacts')
            router.refresh()
        } else {
            setError(result.error || 'Ocurrió un error inesperado')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {dict.contact_form.name} *
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                </div>

                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {dict.contact_form.org}
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                </div>

                {/* WhatsApp ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {dict.contact_form.waid}
                    </label>
                    <input
                        type="text"
                        placeholder="58412..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.waid}
                        onChange={(e) => setFormData({ ...formData, waid: e.target.value })}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {dict.contact_form.tags}
                    </label>
                    <input
                        type="text"
                        placeholder="Cliente, Importante,..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={loading}
                >
                    {dict.common.cancel}
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? dict.common.loading : dict.common.save}
                </button>
            </div>
        </form>
    )
}
