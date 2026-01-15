'use client'

import { Copy, Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { getDictionary } from '@/dictionaries'

type QuoteData = {
    id: string
    total: number
    contacts: { full_name: string }
    quote_items: {
        product_name: string
        quantity: number
        unit_price: number
        total: number
    }[]
}

export default function QuoteActions({ quote }: { quote: QuoteData }) {
    const [copied, setCopied] = useState(false)
    const dict = getDictionary()

    const generateWhatsAppText = () => {
        const header = dict.quotes.wa_template_header.replace('{name}', quote.contacts.full_name) + '\n\n'
        const items = quote.quote_items.map(item =>
            `• ${item.quantity}x ${item.product_name}: $${item.total.toFixed(2)}`
        ).join('\n')
        const footer = `\n\n*${dict.common.total}: $${Number(quote.total).toFixed(2)}*`

        return `${header}${items}${footer}`
    }

    const copyToClipboard = () => {
        const text = generateWhatsAppText()
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const openWhatsApp = () => {
        const text = encodeURIComponent(generateWhatsAppText())
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    return (
        <div className="flex gap-4">
            <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? dict.quote_details.copied : dict.quote_details.copy_wa}
            </button>

            <button
                onClick={openWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20"
            >
                <Share2 className="w-4 h-4" />
                {dict.quote_details.send_wa}
            </button>
        </div>
    )
}
