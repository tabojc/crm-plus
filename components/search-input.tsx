'use client'

import { Search } from 'lucide-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    )
}
