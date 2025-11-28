import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        today_sales: 0,
        today_receipts: 0,
        today_fek: 0,
        today_products: 0
    });
    const [recentReceipts, setRecentReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch stats
            const statsResponse = await fetch('/api/dashboard/stats', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }
            }

            // Fetch recent receipts
            const receiptsResponse = await fetch('/api/dashboard/recent-receipts?limit=5', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (receiptsResponse.ok) {
                const receiptsData = await receiptsResponse.json();
                if (receiptsData.success) {
                    setRecentReceipts(receiptsData.data);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('el-GR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Γρήγορες Ενέργειες</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/sale')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-left transition flex items-center gap-3"
                        >
                            <span className="text-xl">🛒</span>
                            <div>
                                <div className="font-medium">Νέα Πώληση</div>
                                <div className="text-sm opacity-90">Δημιουργία νέας απόδειξης</div>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/receipts')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-left transition flex items-center gap-3"
                        >
                            <span className="text-xl">�</span>
                            <div>
                                <div className="font-medium">Αποδείξεις</div>
                                <div className="text-sm opacity-90">Προβολή όλων των αποδείξεων</div>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/reports')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-left transition flex items-center gap-3"
                        >
                            <span className="text-xl">📊</span>
                            <div>
                                <div className="font-medium">Αναφορές</div>
                                <div className="text-sm opacity-90">Στατιστικά και αναφορές</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Πρόσφατες Αποδείξεις</h2>
                        <button
                            onClick={() => navigate('/receipts')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Προβολή όλων →
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Φόρτωση...</p>
                        </div>
                    ) : recentReceipts.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            Δεν υπάρχουν πρόσφατες αποδείξεις
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentReceipts.map((receipt) => (
                                <div key={receipt.id} className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm text-blue-600">
                                                    {receipt.receipt_number}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {receipt.items_count} είδη
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    {formatDateTime(receipt.created_at)}
                                                </span>
                                                <span className="font-semibold text-sm text-green-600">
                                                    {formatCurrency(receipt.final_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
