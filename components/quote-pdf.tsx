import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { es } from '@/dictionaries/es'

// Create styles
// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
        lineHeight: 1.5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20
    },
    headerLeft: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    headerRight: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a', // Dark blue
        textTransform: 'uppercase'
    },
    subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#444',
        marginTop: 5
    },
    metaText: {
        fontSize: 10,
        color: '#666'
    },
    customerSection: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f8fafc',
        borderRadius: 4
    },
    customerRow: {
        fontSize: 10,
        marginBottom: 2
    },
    label: {
        fontWeight: 'bold',
        color: '#444'
    },
    table: {
        marginTop: 20,
        marginBottom: 20
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginBottom: 4,
        fontWeight: 'bold',
        fontSize: 9,
        color: '#475569'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 6,
        paddingHorizontal: 4,
        fontSize: 9
    },
    colProduct: { width: '55%' },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },

    productName: { fontWeight: 'bold', color: '#333' },

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8'
    },
    totalsContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 4,
        width: 200
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'right',
        marginRight: 10,
        color: '#666'
    },
    totalValue: {
        fontSize: 10,
        width: 80,
        textAlign: 'right'
    },
    finalTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'right',
        marginRight: 10,
        color: '#333'
    },
    finalTotalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 80,
        textAlign: 'right',
        color: '#2563eb'
    }
});

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

const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date)
}

const QuotePDF = ({ quote }: { quote: QuoteData }) => {
    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'MOBIMED, C.A.'
    const total = Number(quote.total)
    const subtotal = total / 1.16
    const tax = total - subtotal

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.mainTitle}>{companyName}</Text>
                        <Text style={{ fontSize: 9, color: '#666', marginTop: 2 }}>{es.pdf.rif}: J-504620210</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.subTitle}>{es.pdf.quote_title}: #{quote.number || '0000'}</Text>
                        <Text style={styles.metaText}>{es.pdf.date}: {formatDate(quote.created_at)}</Text>
                    </View>
                </View>

                {/* Customer Info */}
                <View style={styles.customerSection}>
                    <Text style={styles.customerRow}>
                        <Text style={styles.label}>{es.pdf.client}: </Text>
                        {quote.contacts.full_name}
                    </Text>
                    <Text style={styles.customerRow}>
                        <Text style={styles.label}>{es.pdf.address}: </Text>
                        {quote.contacts.address || 'Maracay'}
                    </Text>
                    <Text style={styles.customerRow}>
                        <Text style={styles.label}>{es.pdf.phone}: </Text>
                        {quote.contacts.phone || 'N/A'}
                    </Text>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colProduct}>{es.pdf.table_product}</Text>
                        <Text style={styles.colQty}>{es.pdf.table_qty}</Text>
                        <Text style={styles.colPrice}>{es.pdf.table_price}</Text>
                        <Text style={styles.colTotal}>{es.pdf.table_total}</Text>
                    </View>
                    {quote.quote_items.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.colProduct}>
                                <Text style={styles.productName}>{item.product_name}</Text>
                            </View>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colPrice}>${Number(item.unit_price).toFixed(2)}</Text>
                            <Text style={styles.colTotal}>${Number(item.total).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{es.pdf.subtotal}:</Text>
                        <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{es.pdf.tax} (16%):</Text>
                        <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.totalRow, { marginTop: 4 }]}>
                        <Text style={styles.finalTotalLabel}>{es.pdf.total_amount}:</Text>
                        <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>{es.pdf.footer_text}</Text>
                </View>

            </Page>
        </Document>
    )
}

export default QuotePDF
