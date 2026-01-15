import { getDictionary } from '@/dictionaries'
import ContactForm from '@/components/contact-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getContact } from '@/app/lib/actions'
import { notFound } from 'next/navigation'

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const contact = await getContact(id)
    const dict = await getDictionary()

    if (!contact) {
        notFound()
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/dashboard/contacts"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {dict.common.back}
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dict.contact_form.edit_title}
                </h1>
            </div>

            <ContactForm dict={dict} initialData={contact} isEdit />
        </div>
    )
}
