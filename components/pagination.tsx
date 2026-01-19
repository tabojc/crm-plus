'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const currentPage = Number(searchParams.get('page')) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        replace(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                className={`p-2 rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                disabled={currentPage === 1}
                onClick={() => createPageURL(currentPage - 1)}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className={`p-2 rounded-md border ${currentPage >= totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                disabled={currentPage >= totalPages}
                onClick={() => createPageURL(currentPage + 1)}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}
