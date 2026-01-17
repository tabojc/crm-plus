'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Trash2, User, Package, Save, ChevronDown } from 'lucide-react'
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
    price_offer: number
    price_min: number
    image_url?: string
}

type QuoteItem = {
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    image_url?: string
    // Helper to track which tier is selected (1=List, 2=Offer, 3=Min)
    selected_tier: 1 | 2 | 3
    // Store all prices to allow switching
    prices: {
        p1: number
        p2: number
        p3: number
    }
}

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateQuoteForm() {
    const router = useRouter()
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
        const results = await searchProducts(query) as unknown as Product[]
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
                unit_price: product.price_list, // Default to Price 1
                image_url: product.image_url,
                selected_tier: 1,
                prices: {
                    p1: product.price_list,
                    p2: product.price_offer,
                    p3: product.price_min
                }
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

    // Update Price Tier
    const updatePriceTier = (productId: string, tier: 1 | 2 | 3) => {
        setCart(current => current.map(item => {
            if (item.product_id === productId) {
                let newPrice = item.prices.p1
                if (tier === 2) newPrice = item.prices.p2
                if (tier === 3) newPrice = item.prices.p3
                return { ...item, selected_tier: tier, unit_price: newPrice }
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
            items: cart.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                price_type: item.selected_tier
            }))
        })

        if (result.success) {
            router.push('/dashboard/quotes')
        } else {
            alert('Error creating quote: ' + result.error)
            setSubmitting(false)
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const tax = subtotal * 0.16
    const totalAmount = subtotal + tax

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="space-y-8">

                {/* SECTION 1: Customer */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-blue-500" />
                            {dict.quotes.step_contact}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedContact ? (
                            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{selectedContact.full_name}</p>
                                    <p className="text-sm text-gray-500">{selectedContact.organization}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedContact(null)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                >
                                    {dict.common.edit}
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                                <Input
                                    type="text"
                                    placeholder={dict.quotes.select_contact_placeholder}
                                    className="pl-10"
                                    onChange={(e) => {
                                        setContactSearch(e.target.value)
                                        handleSearchContacts(e.target.value)
                                    }}
                                />
                                {contactResults.length > 0 && (
                                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        {contactResults.map(contact => (
                                            <button
                                                key={contact.id}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-0 border-gray-100 dark:border-gray-700 flex flex-col"
                                                onClick={() => {
                                                    setSelectedContact(contact)
                                                    setContactResults([])
                                                }}
                                            >
                                                <span className="font-medium text-gray-900 dark:text-white">{contact.full_name}</span>
                                                <span className="text-xs text-gray-500">{contact.organization}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SECTION 2: Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="w-5 h-5 text-purple-500" />
                            {dict.quotes.step_products}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                            <Input
                                type="text"
                                placeholder={dict.quotes.search_products}
                                className="pl-10"
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value)
                                    handleSearchProducts(e.target.value)
                                }}
                            />
                            {productResults.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-y-auto">
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
                                                <div className="flex gap-2 text-xs">
                                                    <span className="text-green-600 font-bold">${product.price_list}</span>
                                                    <span className="text-gray-400">|</span>
                                                    <span className="text-gray-500">${product.price_offer}</span>
                                                </div>
                                            </div>
                                            <Plus className="w-4 h-4 text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                                    <p className="text-gray-400 text-sm">{dict.quotes.cart_empty}</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product_id} className="group p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 items-center">

                                            {/* 1. Image */}
                                            <div className="w-16 h-16 bg-white rounded-md relative overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                                {item.image_url && (
                                                    <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                                                )}
                                            </div>

                                            {/* 2. Info & Selector */}
                                            <div className="min-w-0 space-y-2">
                                                <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug" title={item.product_name}>
                                                    {item.product_name}
                                                </p>
                                                <select
                                                    className="w-full sm:w-auto max-w-[200px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs py-1.5 px-2 focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                    value={item.selected_tier}
                                                    onChange={(e) => updatePriceTier(item.product_id, Number(e.target.value) as 1 | 2 | 3)}
                                                >
                                                    <option value={1}>{dict.products?.price_list ?? 'Precio 1'} (${item.prices.p1})</option>
                                                    <option value={2}>{dict.products?.price_offer ?? 'Precio 2'} (${item.prices.p2})</option>
                                                    <option value={3}>{dict.products?.price_min ?? 'Precio 3'} (${item.prices.p3})</option>
                                                </select>
                                            </div>

                                            {/* 3. Actions (Qty, Price, Delete) */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-700">

                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.product_id, -1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.product_id, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>

                                                <div className="text-right min-w-[80px]">
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                        ${(item.quantity * item.unit_price).toFixed(2)}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.product_id)}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 3: Summary (Bottom) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{dict.quotes.step_summary}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">IVA (16%)</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="py-6 flex justify-between items-end">
                            <span className="text-gray-900 dark:text-white font-bold text-lg">{dict.quotes.summary_total}</span>
                            <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedContact || cart.length === 0 || submitting}
                            className="w-full h-12 text-lg"
                        >
                            {submitting ? dict.common.loading : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {dict.quotes.btn_save}
                                </>
                            )}
                        </Button>
                        {!selectedContact && (
                            <p className="text-xs text-red-500 mt-4 text-center">Please select a customer first.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
