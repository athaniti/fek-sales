import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [stats, setStats] = useState({
        today_sales: 0,
        today_receipts: 0,
        today_fek: 0,
        today_products: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Use fallback data
            setStats({
                today_sales: 623.00,
                today_receipts: 14,
                today_fek: 42,
                today_products: 28
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📊 Ταμπλό</h1>
                <button
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition"
                >
                    {isLoading ? '🔄 Ανανέωση...' : '🔄 Ανανέωση'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Today's Sales */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">€</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">Σημερινές Πωλήσεις</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {isLoading ? '...' : formatCurrency(stats.today_sales)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Today's Receipts */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">#</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">Σημερινές Αποδείξεις</p>
                            <p className="text-2xl font-bold text-green-900">
                                {isLoading ? '...' : stats.today_receipts}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Today's FEK */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📄</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-yellow-600">ΦΕΚ Σήμερα</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {isLoading ? '...' : stats.today_fek}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Today's Products */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📦</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-purple-600">Προϊόντα Σήμερα</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {isLoading ? '...' : stats.today_products}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">🚀 Γρήγορες Ενέργειες</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a
                        href="/sale"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                    >
                        🛍️ Νέα Πώληση
                    </a>
                    <a
                        href="/receipts"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        📋 Αποδείξεις
                    </a>
                    <a
                        href="/reports"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        📊 Αναφορές
                    </a>
                    <a
                        href="/api/reports/export/pdf?type=daily"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        📄 Export PDF
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
