
import { getDictionary } from '@/dictionaries'
import { getContactsCount, getQuotesCount } from '@/app/lib/actions'

export default async function DashboardPage() {
    const dict = getDictionary()
    const contactsCount = await getContactsCount()
    const quotesCount = await getQuotesCount()

    return (
        <div className="p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dict.dashboard.overview}</h2>
                <p className="text-gray-500 dark:text-gray-400">{dict.dashboard.welcome}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{dict.dashboard.total_contacts}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{contactsCount.toLocaleString()}</p>
                    <div className="mt-4 text-sm text-green-600 flex items-center">
                        {dict.dashboard.new_today.replace('{count}', '12')}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{dict.dashboard.total_quotes}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{quotesCount.toLocaleString()}</p>
                    <div className="mt-4 text-sm text-blue-600 flex items-center">
                        {dict.dashboard.recent_activity}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{dict.dashboard.products}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">129</p>
                    <div className="mt-4 text-sm text-gray-500">
                        {dict.dashboard.active_catalog}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{dict.dashboard.system_status}</h3>
                    <p className="text-3xl font-bold text-emerald-500 mt-2">{dict.dashboard.online}</p>
                    <div className="mt-4 text-sm text-gray-500">
                        {dict.dashboard.version}
                    </div>
                </div>
            </div>
        </div>
    )
}
