'use client'

import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteContact } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ContactActionsProps {
    contactId: string
    dict: any
}

export default function ContactActions({ contactId, dict }: ContactActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(dict.contact_form.confirm_delete)) return

        setIsDeleting(true)
        const result = await deleteContact(contactId)

        if (result.success) {
            router.refresh()
        } else {
            alert('Error deleting contact')
        }
        setIsDeleting(false)
    }

    return (
        <div className="flex justify-end gap-2">
            <Link
                href={`/dashboard/contacts/${contactId}/edit`}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title={dict.common.edit}
            >
                <Edit className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                title={dict.common.delete}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
