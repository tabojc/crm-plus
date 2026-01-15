
import CreateQuoteForm from '@/components/create-quote-form'
import { getDictionary } from '@/dictionaries'

export default function CreateQuotePage() {
    const dict = getDictionary()
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dict.quotes.new_quote}</h2>
                <div className="flex items-center gap-2">
                    <p className="text-gray-500 dark:text-gray-400">{dict.quotes.builder_title}</p>
                    {/* Dev Mode Indicator requested by user */}
                    {process.env.NODE_ENV === 'development' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200">
                            {dict.common.environment_local}
                        </span>
                    )}
                </div>
            </header>

            <CreateQuoteForm />
        </div>
    )
}
