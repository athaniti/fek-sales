import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from '../Components/Common/Button';
import Loading from '../Components/Common/Loading';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });

    const tabs = [
        { id: 'daily', label: '📅 Ημερήσια', icon: '📅' },
        { id: 'monthly', label: '📊 Μηνιαία', icon: '📊' },
        { id: 'yearly', label: '📈 Ετήσια', icon: '📈' }
    ];

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const generateReport = async () => {
        setLoading(true);
        setReportData(null);

        try {
            let url = '/api/reports/';
            let params = new URLSearchParams();

            switch (activeTab) {
                case 'daily':
                    url += 'daily';
                    params.append('date', filters.date);
                    break;
                case 'monthly':
                    url += 'monthly';
                    params.append('year', filters.year);
                    params.append('month', filters.month);
                    break;
                case 'yearly':
                    url += 'yearly';
                    params.append('year', filters.year);
                    break;
            }

            const response = await fetch(`${url}?${params}`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setReportData(data.data);
                }
            } else {
                throw new Error('Failed to fetch report');
            }
        } catch (error) {
            alert('Σφάλμα κατά τη δημιουργία αναφοράς');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const printReport = () => {
        window.print();
    };

    const exportPDF = () => {
        let params = new URLSearchParams();
        params.append('type', activeTab);

        switch (activeTab) {
            case 'daily':
                params.append('date', filters.date);
                break;
            case 'monthly':
                params.append('date', `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`);
                break;
            case 'yearly':
                params.append('date', `${filters.year}-01-01`);
                break;
        }

        window.open(`/api/reports/export/pdf?${params}`, '_blank');
    };

    const exportExcel = () => {
        let params = new URLSearchParams();
        params.append('type', activeTab);

        switch (activeTab) {
            case 'daily':
                params.append('date', filters.date);
                break;
            case 'monthly':
                params.append('date', `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`);
                break;
            case 'yearly':
                params.append('date', `${filters.year}-01-01`);
                break;
        }

        window.open(`/api/reports/export/excel?${params}`, '_blank');
    };

    const previewPDF = () => {
        let params = new URLSearchParams();
        params.append('type', activeTab);

        switch (activeTab) {
            case 'daily':
                params.append('date', filters.date);
                break;
            case 'monthly':
                params.append('date', `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`);
                break;
            case 'yearly':
                params.append('date', `${filters.year}-01-01`);
                break;
        }

        window.open(`/api/reports/export/pdf/preview?${params}`, '_blank');
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📊 Αναφορές Πωλήσεων</h1>
                {reportData && (
                    <div className="flex gap-2">
                        <Button onClick={exportPDF} variant="secondary">
                            📄 PDF
                        </Button>
                        <Button onClick={exportExcel} variant="secondary">
                            📊 CSV
                        </Button>
                        <Button onClick={previewPDF} variant="secondary">
                            👁️ Προεπισκόπηση
                        </Button>
                        <Button onClick={printReport} variant="secondary">
                            🖨️ Εκτύπωση
                        </Button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {activeTab === 'daily' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Ημερομηνία</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">Έτος</label>
                            <input
                                type="number"
                                name="year"
                                min="2020"
                                max="2030"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Μήνας</label>
                            <select
                                name="month"
                                value={filters.month}
                                onChange={handleFilterChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2024, i).toLocaleString('el-GR', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {activeTab === 'yearly' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Έτος</label>
                        <input
                            type="number"
                            name="year"
                            min="2020"
                            max="2030"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                <div className="flex items-end">
                    <Button onClick={generateReport} loading={loading} className="w-full">
                        🔍 Δημιουργία Αναφοράς
                    </Button>
                </div>
            </div>

            {/* Report Display */}
            {loading && <Loading text="Δημιουργία αναφοράς..." />}

            {reportData && (
                <div className="border-t pt-6 print:border-t-0 print:pt-0">
                    {/* Header */}
                    <div className="mb-6 text-center print:mb-4">
                        <h2 className="text-xl font-bold mb-2">
                            {reportData.period?.title || 'Αναφορά Πωλήσεων'}
                        </h2>
                        <p className="text-gray-600">
                            Περίοδος: {reportData.period?.start} - {reportData.period?.end}
                        </p>
                        <p className="text-sm text-gray-500">
                            Δημιουργήθηκε στις: {new Date().toLocaleString('el-GR')}
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:grid-cols-3 print:gap-2">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                            <div className="text-sm text-blue-600 mb-1">Αποδείξεις</div>
                            <div className="text-2xl font-bold">{reportData.totals?.receipts_count || 0}</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                            <div className="text-sm text-green-600 mb-1">Σύνολο Προ Έκπτωσης</div>
                            <div className="text-xl font-bold">
                                {formatCurrency(reportData.totals?.gross_amount || 0)}
                            </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded p-4 text-center">
                            <div className="text-sm text-purple-600 mb-1">Συνολικό Ποσό</div>
                            <div className="text-xl font-bold">
                                {formatCurrency(reportData.totals?.total_amount || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Main Sales Summary by Type */}
                    {reportData.items_by_type && reportData.items_by_type.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-4 text-lg">📊 Συγκεντρωτική Αναφορά Πωλήσεων</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r">
                                                Είδος
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r">
                                                Τεμάχια
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Συνολικό Ποσό Είδους
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportData.items_by_type.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 border-r">
                                                    <div className="flex items-center">
                                                        <span className="text-2xl mr-3">{item.type_icon}</span>
                                                        <span className="font-semibold text-lg">{item.type_label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-lg border-r">
                                                    {item.quantity.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-lg text-green-600">
                                                    {formatCurrency(item.total_amount)}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Total Row */}
                                        <tr className="bg-gray-100 font-bold text-lg">
                                            <td className="px-6 py-4 border-r">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-3">📋</span>
                                                    <span>ΣΥΝΟΛΟ</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center border-r">
                                                {reportData.items_by_type.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-green-700">
                                                {formatCurrency(reportData.totals?.total_amount || 0)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Receipts List */}
                    {reportData.receipts && reportData.receipts.length > 0 && (
                        <div className="print:break-before-page">
                            <h3 className="font-bold mb-4 text-lg">📋 Λίστα Αποδείξεων</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Αριθμός
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Ημερομηνία
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Ώρα
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Υπάλληλος
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Είδη
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Ποσό
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Κατάσταση
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportData.receipts.map((receipt) => (
                                            <tr key={receipt.receipt_number} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">
                                                    {receipt.receipt_number}
                                                </td>
                                                <td className="px-4 py-3">{receipt.date}</td>
                                                <td className="px-4 py-3">{receipt.time}</td>
                                                <td className="px-4 py-3">{receipt.user}</td>
                                                <td className="px-4 py-3 text-center">{receipt.items_count}</td>
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    {formatCurrency(receipt.final_amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            receipt.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {receipt.status_label}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loading && !reportData && (
                <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-xl mb-2">Επιλέξτε παραμέτρους αναφοράς</div>
                    <div>Πατήστε "Δημιουργία Αναφοράς" για να δείτε τα αποτελέσματα</div>
                </div>
            )}

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print\\:break-before-page {
                        break-before: page;
                    }

                    .print\\:border-t-0 {
                        border-top: 0 !important;
                    }

                    .print\\:pt-0 {
                        padding-top: 0 !important;
                    }

                    .print\\:mb-4 {
                        margin-bottom: 1rem !important;
                    }

                    .print\\:grid-cols-4 {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    }

                    .print\\:gap-2 {
                        gap: 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
