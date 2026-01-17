'use client'

import { Copy, Share2, Check, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getDictionary } from '@/dictionaries'
import { PDFDownloadLink } from '@react-pdf/renderer'
import QuotePDF from './quote-pdf'

type QuoteData = {
    id: string
    number: number
    created_at: string
    total: number
    contacts: {
        full_name: string
        organization: string
        phone?: string
        address?: string
    }
    quote_items: {
        product_name: string
        quantity: number
        unit_price: number
        total: number
    }[]
}

import { Button } from '@/components/ui/button'

export default function QuoteActions({ quote }: { quote: QuoteData }) {
    const [copied, setCopied] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const dict = getDictionary()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const generateWhatsAppText = () => {
        const header = dict.quotes.wa_template_header.replace('{name}', quote.contacts.full_name) + '\n\n'
        const items = quote.quote_items.map(item =>
            `• ${item.quantity}x ${item.product_name}: $${Number(item.total).toFixed(2)}`
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

    if (!isMounted) {
        return (
            <div className="flex gap-4">
                <Button disabled variant="outline" className="text-gray-400 cursor-not-allowed">
                    <Download className="w-4 h-4 mr-2" />
                    {dict.quote_details.download_pdf}
                </Button>

                <Button disabled variant="outline" className="opacity-50">
                    <Copy className="w-4 h-4 mr-2" />
                    {dict.quote_details.copy_wa}
                </Button>

                <Button disabled className="bg-green-500 text-white opacity-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    {dict.quote_details.send_wa}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex gap-4">
            <PDFDownloadLink
                document={<QuotePDF quote={quote} />}
                fileName={`cotizacion-${quote.number}.pdf`}
                className="flex items-center"
            >
                {({ blob, url, loading, error }) => (
                    <Button variant="outline" disabled={loading}>
                        {loading ? (
                            "Loading..."
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                {dict.quote_details.download_pdf}
                            </>
                        )}
                    </Button>
                )}
            </PDFDownloadLink>

            <Button onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? dict.quote_details.copied : dict.quote_details.copy_wa}
            </Button>

            <Button
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
            >
                <Share2 className="w-4 h-4 mr-2" />
                {dict.quote_details.send_wa}
            </Button>
        </div>
    )
}
