import SearchInput from '@/components/search-input'
import { searchContacts, getContactsCount } from '@/app/lib/actions'
import ContactActions from '@/components/contact-row-actions'
import Link from 'next/link'
import { X, Plus } from 'lucide-react'
import { getDictionary } from '@/dictionaries'

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{
        query?: string
        tag?: string
    }>
}) {
    const params = await searchParams
    const query = params?.query || ''
    const tag = params?.tag || ''
    const [contacts, totalCount] = await Promise.all([
        searchContacts(query, tag),
        getContactsCount()
    ])
    const dict = getDictionary()

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dict.contacts.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {dict.contacts.subtitle.replace('{count}', totalCount.toLocaleString())}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <SearchInput placeholder={dict.common.search_placeholder} />
                    <Link
                        href="/dashboard/contacts/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                        title={dict.contact_form.new_title}
                    >
                        <Plus className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <div className="flex gap-2 mb-4">
                {tag && (
                    <Link
                        href="/dashboard/contacts"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200"
                    >
                        {dict.contacts.filter_tag} {tag} <X className="w-3 h-3" />
                    </Link>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.contacts.table_name}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.contacts.table_org}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.contacts.table_phone} (WAID)</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.contacts.table_tags}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">{dict.common.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        {dict.contacts.no_results}
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact: any) => (
                                    <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{contact.full_name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {contact.organization || <span className="text-gray-400 italic">--</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                            {contact.phone || contact.waid || '--'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {contact.tags && contact.tags.length > 0 ? (
                                                    contact.tags.map((t: string, i: number) => (
                                                        <Link
                                                            key={i}
                                                            href={`/dashboard/contacts?tag=${t}`}
                                                            className={`px-2 py-1 rounded-full text-xs hover:opacity-80 transition-opacity ${tag === t
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                                }`}
                                                        >
                                                            {t}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No tags</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <Link
                                                    href={`/dashboard/quotes/create?contactId=${contact.id}`}
                                                    className="text-blue-600 hover:text-blue-500 font-medium text-xs whitespace-nowrap"
                                                >
                                                    {dict.contacts.create_quote}
                                                </Link>
                                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                                                <ContactActions contactId={contact.id} dict={dict} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
                Showing top results. Refine your search to find specific contacts.
            </div>
        </div>
    )
}
