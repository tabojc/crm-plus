
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingBag, LogOut, Settings, Menu, X } from 'lucide-react'

export default function MobileNav({ dict, user, onSignOut }: { dict: any, user: any, onSignOut: () => Promise<void> }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className="md:hidden">
            {/* Mobile Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CRM Plus
                </h1>
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-[65px] left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg z-50">
                    <nav className="p-4 space-y-2">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            {dict.nav.dashboard}
                        </Link>
                        <Link
                            href="/dashboard/contacts"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Users className="w-5 h-5" />
                            {dict.nav.contacts}
                        </Link>
                        <Link
                            href="/dashboard/products"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {dict.nav.products}
                        </Link>


                        <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                                    {user.email?.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <form action={onSignOut}>
                                <button className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    {dict.nav.logout}
                                </button>
                            </form>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    )
}
