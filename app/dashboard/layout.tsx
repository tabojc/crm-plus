
import { type ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Users, ShoppingBag, LogOut, Settings, FileText } from 'lucide-react'
import { getDictionary } from '@/dictionaries'

import MobileNav from '@/components/mobile-nav'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const dict = getDictionary()

    if (!user) {
        redirect('/login')
    }

    // Logout Action
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 flex-col md:flex-row">
            <MobileNav dict={dict} user={user} onSignOut={signOut} />

            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CRM Plus
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        {dict.nav.dashboard}
                    </Link>
                    <Link href="/dashboard/contacts" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        {dict.nav.contacts}
                    </Link>
                    <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        {dict.nav.products}
                    </Link>
                    <Link href="/dashboard/quotes" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                        {dict.nav.quotes}
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        {dict.nav.settings}
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
                    <form action={signOut}>
                        <button className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" />
                            {dict.nav.logout}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
