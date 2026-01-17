
export type QuoteItemInput = {
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    price_type?: 1 | 2 | 3
}

export type CreateQuoteInput = {
    contact_id: string
    items: QuoteItemInput[]
}

export type ContactInput = {
    full_name: string
    organization?: string
    waid?: string
    phone?: string
    tags?: string[]
}
