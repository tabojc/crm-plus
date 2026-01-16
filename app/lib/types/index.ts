
export type QuoteItemInput = {
    product_id?: string
    product_name: string
    quantity: number
    unit_price: number
}

export type CreateQuoteInput = {
    contact_id: string
    items: QuoteItemInput[]
}

export type ContactInput = {
    full_name: string
    organization?: string
    waid?: string
    tags?: string[]
}
