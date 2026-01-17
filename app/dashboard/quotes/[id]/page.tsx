import { getQuote } from '@/app/lib/actions'
import QuoteActions from '@/components/quote-actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/dictionaries'

export default async function QuoteDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const quote = await getQuote(id)
    const dict = getDictionary()

    if (!quote) {
        notFound()
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link
                href="/dashboard/quotes"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                {dict.common.back}
            </Link>

            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {dict.quote_details.title} #{quote.number}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="font-medium text-gray-900 dark:text-white">{quote.contacts.full_name}</span>
                        <span>•</span>
                        <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <QuoteActions quote={quote} />
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{dict.common.items}</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {quote.quote_items.map((item: any) => (
                        <div key={item.id} className="p-6 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-gray-500">{item.quantity} x ${item.unit_price}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.price_type === 2 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                        item.price_type === 3 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' :
                                            'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}>
                                        {item.price_type === 1 ? 'Precio Lista' :
                                            item.price_type === 2 ? 'Precio Oferta' :
                                                item.price_type === 3 ? 'Precio Mínimo' : 'Precio Lista'}
                                    </span>
                                </div>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                                ${Number(item.total).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-950/50 flex flex-col items-end gap-2">
                    <div className="w-full max-w-xs flex justify-between text-sm text-gray-500">
                        <span>Subtotal:</span>
                        <span>${(Number(quote.total) / 1.16).toFixed(2)}</span>
                    </div>
                    <div className="w-full max-w-xs flex justify-between text-sm text-gray-500">
                        <span>IVA (16%):</span>
                        <span>${(Number(quote.total) - (Number(quote.total) / 1.16)).toFixed(2)}</span>
                    </div>
                    <div className="w-full max-w-xs flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                        <span>{dict.quotes.summary_total}:</span>
                        <span>${Number(quote.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
