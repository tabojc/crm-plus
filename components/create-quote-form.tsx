'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Trash2, User, Package, Save } from 'lucide-react'
import { searchContacts, searchProducts, createQuote } from '@/app/lib/actions'
import { useDebouncedCallback } from 'use-debounce'
import Image from 'next/image'
import { getDictionary } from '@/dictionaries'

type Contact = {
    id: string
    full_name: string
    organization: string
}

type Product = {
    id: string
    name: string
    price_list: number
    image_url?: string
}

type QuoteItem = {
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    image_url?: string
}

export default function CreateQuoteForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const dict = getDictionary()

    // State: Contact Selection
    const [contactSearch, setContactSearch] = useState('')
    const [contactResults, setContactResults] = useState<Contact[]>([])
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    // State: Product Selection
    const [productSearch, setProductSearch] = useState('')
    const [productResults, setProductResults] = useState<Product[]>([])
    const [cart, setCart] = useState<QuoteItem[]>([])

    // Search Contacts
    const handleSearchContacts = useDebouncedCallback(async (query) => {
        if (!query) {
            setContactResults([])
            return
        }
        setLoading(true)
        const results = await searchContacts(query)
        setContactResults(results || [])
        setLoading(false)
    }, 300)

    // Search Products
    const handleSearchProducts = useDebouncedCallback(async (query) => {
        if (!query) {
            setProductResults([])
            return
        }
        setLoading(true)
        const results = await searchProducts(query)
        setProductResults(results || [])
        setLoading(false)
    }, 300)

    // Add to Cart
    const addToCart = (product: Product) => {
        setCart(current => {
            const existing = current.find(item => item.product_id === product.id)
            if (existing) {
                return current.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...current, {
                product_id: product.id,
                product_name: product.name,
                quantity: 1,
                unit_price: product.price_list,
                image_url: product.image_url
            }]
        })
        setProductSearch('')
        setProductResults([])
    }

    // Update Quantity
    const updateQuantity = (productId: string, delta: number) => {
        setCart(current => current.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    // Remove Item
    const removeItem = (productId: string) => {
        setCart(current => current.filter(item => item.product_id !== productId))
    }

    // Submit Quote
    const handleSubmit = async () => {
        if (!selectedContact || cart.length === 0) return

        setSubmitting(true)
        const result = await createQuote({
            contact_id: selectedContact.id,
            items: cart
        })

        if (result.success) {
            router.push('/dashboard/quotes')
        } else {
            alert('Error creating quote: ' + result.error)
            setSubmitting(false)
        }
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Builder */}
            <div className="lg:col-span-2 space-y-8">

                {/* SECTION 1: Customer */}
                <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-blue-500" />
                        {dict.quotes.step_contact}
                    </h3>

                    {selectedContact ? (
                        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{selectedContact.full_name}</p>
                                <p className="text-sm text-gray-500">{selectedContact.organization}</p>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {dict.common.edit}
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={dict.quotes.select_contact_placeholder}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                onChange={(e) => {
                                    setContactSearch(e.target.value)
                                    handleSearchContacts(e.target.value)
                                }}
                            />
                            {contactResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {contactResults.map(contact => (
                                        <button
                                            key={contact.id}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-0 border-gray-100 dark:border-gray-700"
                                            onClick={() => {
                                                setSelectedContact(contact)
                                                setContactResults([])
                                            }}
                                        >
                                            <p className="font-medium text-gray-900 dark:text-white">{contact.full_name}</p>
                                            <p className="text-xs text-gray-500">{contact.organization}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* SECTION 2: Products */}
                <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-purple-500" />
                        {dict.quotes.step_products}
                    </h3>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={dict.quotes.search_products}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value)
                                handleSearchProducts(e.target.value)
                            }}
                        />
                        {productResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {productResults.map(product => (
                                    <button
                                        key={product.id}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-0 border-gray-100 dark:border-gray-700 flex items-center gap-3"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0">
                                            {product.image_url ? (
                                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-green-600 font-bold">${product.price_list}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                                <p className="text-gray-400 text-sm">{dict.quotes.cart_empty}</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-white rounded-md relative overflow-hidden shadow-sm flex-shrink-0">
                                            {item.image_url && (
                                                <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white truncate pr-4">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">${item.unit_price} each</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                                            <button
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => updateQuantity(item.product_id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => updateQuantity(item.product_id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="w-20 text-right font-bold text-sm">
                                            ${(item.quantity * item.unit_price).toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{dict.quotes.step_summary}</h3>

                    <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                            <span className="font-medium">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                    </div>

                    <div className="py-6 flex justify-between items-end">
                        <span className="text-gray-900 dark:text-white font-bold text-lg">{dict.quotes.summary_total}</span>
                        <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedContact || cart.length === 0 || submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                        {submitting ? dict.common.loading : (
                            <>
                                <Save className="w-4 h-4" />
                                {dict.quotes.btn_save}
                            </>
                        )}
                    </button>

                    {!selectedContact && (
                        <p className="text-xs text-red-500 mt-4 text-center">Please select a customer first.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
