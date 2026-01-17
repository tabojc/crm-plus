import { getQuotes } from '@/app/lib/actions'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getDictionary } from '@/dictionaries'

export default async function QuotesPage() {
    const quotes = await getQuotes()
    const dict = getDictionary()

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dict.quotes.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{dict.quotes.subtitle}</p>
                </div>

                <Link
                    href="/dashboard/quotes/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    {dict.quotes.new_quote}
                </Link>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.common.date}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.contacts.table_name}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.common.total}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{dict.common.status}</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">{dict.common.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {quotes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        {dict.quotes.empty}
                                    </td>
                                </tr>
                            ) : (
                                quotes.map((quote: any) => (
                                    <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {quote.contacts?.full_name || 'Unknown Client'}
                                            {quote.contacts?.organization && (
                                                <span className="block text-xs font-normal text-gray-500">
                                                    {quote.contacts.organization}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                            ${Number(quote.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${quote.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                                    quote.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                {quote.status === 'draft' ? dict.quotes.status_draft :
                                                    quote.status === 'sent' ? dict.quotes.status_sent :
                                                        quote.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/quotes/${quote.id}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                            >
                                                {dict.common.view_details || 'View'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
