
export default function DashboardPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h2>
                <p className="text-gray-500 dark:text-gray-400">Welcome back to your CRM.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12,914</p>
                    <div className="mt-4 text-sm text-green-600 flex items-center">
                        +12 today
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Products</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">129</p>
                    <div className="mt-4 text-sm text-gray-500">
                        Active Catalog
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Status</h3>
                    <p className="text-3xl font-bold text-emerald-500 mt-2">Online</p>
                    <div className="mt-4 text-sm text-gray-500">
                        v1.0.0
                    </div>
                </div>
            </div>
        </div>
    )
}
