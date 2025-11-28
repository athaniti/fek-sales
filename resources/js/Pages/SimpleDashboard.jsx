import React, { useState, useEffect } from 'react';

export default function SimpleDashboard() {
    const [stats, setStats] = useState({
        today_sales: 0,
        today_receipts: 0,
        today_fek: 0,
        today_products: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <div className="text-xl">⏳ Φόρτωση...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">€</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Σημερινές Πωλήσεις
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            €{stats.today_sales.toFixed(2)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">#</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Αποδείξεις
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.today_receipts}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">📄</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            ΦΕΚ Σήμερα
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.today_fek}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">📦</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Προϊόντα
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.today_products}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">🚀 Γρήγορες Ενέργειες</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/sale" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            🛍️ Νέα Πώληση
                        </a>
                        <a href="/receipts" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            📋 Αποδείξεις
                        </a>
                        <a href="/reports" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            📊 Αναφορές
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
