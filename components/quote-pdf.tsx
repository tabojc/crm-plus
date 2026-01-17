import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { es } from '@/dictionaries/es'

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12,
        color: '#333'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20
    },
    companyInfo: {
        flexDirection: 'column',
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2563eb' // Blue-600
    },
    companyDetails: {
        fontSize: 10,
        color: '#666'
    },
    quoteInfo: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#111'
    },
    meta: {
        fontSize: 10,
        marginBottom: 4
    },
    customerSection: {
        marginBottom: 30,
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 4
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    customerName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2
    },
    table: {
        flexDirection: 'column',
        marginBottom: 30
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 8,
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8,
        alignItems: 'center'
    },
    colProduct: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '20%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right' },

    productName: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2
    },
    productDesc: {
        fontSize: 9,
        color: '#666'
    },

    footer: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    totalSection: {
        width: 200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
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

const QuotePDF = ({ quote }: { quote: QuoteData }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    <Text style={styles.title}>{es.quotes.title.toUpperCase()}: #{quote.number || quote.id.slice(0, 8)}</Text>
                    {/* <Text style={styles.meta}>ID: {quote.id.slice(0, 8)}</Text> */}
                </View>
                <View style={styles.quoteInfo}>
                    <Text style={styles.meta}>{new Date(quote.created_at).toLocaleDateString()}</Text>
                </View>
            </View>

            {/* Customer Info */}
            <View style={styles.customerSection}>
                <Text style={styles.sectionTitle}>Cliente</Text>
                <Text style={styles.customerName}>{quote.contacts.full_name}</Text>
                <Text style={styles.companyDetails}>{quote.contacts.organization}</Text>
                <Text style={styles.companyDetails}>{quote.contacts.address || 'Maracay'}</Text>
                {quote.contacts.phone && <Text style={styles.companyDetails}>{quote.contacts.phone}</Text>}
            </View>

            {/* Items Table */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.colProduct}>Producto</Text>
                    <Text style={styles.colQty}>Cant.</Text>
                    <Text style={styles.colPrice}>Precio Unit.</Text>
                    <Text style={styles.colTotal}>Total</Text>
                </View>

                {/* Table Rows */}
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
            <View style={{ marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalAmount}>${Number(quote.total).toFixed(2)}</Text>
                </View>
            </View>

            {/* Footer / Company Info */}
            <View style={styles.footer}>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>CRM Plus</Text>
                    <Text style={styles.companyDetails}>Soluciones Profesionales</Text>
                    <Text style={styles.companyDetails}>contacto@crmplus.com</Text>
                </View>
            </View>

        </Page>
    </Document>
);

export default QuotePDF;
