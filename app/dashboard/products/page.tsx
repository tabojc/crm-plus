import SearchInput from '@/components/search-input'
import { searchProducts } from '@/app/lib/actions'
import Image from 'next/image'
import { getDictionary } from '@/dictionaries'

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        query?: string
        page?: string
    }>
}) {
    const params = await searchParams
    const query = params?.query || ''
    const products = await searchProducts(query)
    const dict = getDictionary()

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dict.products.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{dict.products.subtitle} ({products.length} items)</p>
                </div>
                <SearchInput placeholder={dict.common.search_placeholder} />
            </header>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500">{query ? 'No products found.' : 'Search for a product to see details.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                            {/* Image Aspect Ratio 1:1 */}
                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-950 overflow-hidden">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized={product.image_url.includes('127.0.0.1')}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                                        <span className="text-xs font-medium">No Image</span>
                                    </div>
                                )}

                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 min-h-[2.5em]">
                                    {product.name}
                                </h3>

                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{dict.products.price_list}</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-200">${Number(product.price_list).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{dict.products.price_offer}</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">${Number(product.price_offer).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{dict.products.price_min}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">${Number(product.price_min).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
