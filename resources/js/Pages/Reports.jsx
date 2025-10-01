import React, { useState } from 'react';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from '../Components/Common/Button';
import Loading from '../Components/Common/Loading';

export default function Reports() {
    const [reportType, setReportType] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });

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
            let url = '/reports/';
            let params = new URLSearchParams();

            switch (reportType) {
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

            const response = await api.get(`${url}?${params}`);
            if (response.data.success) {
                setReportData(response.data.data);
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

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Αναφορές Πωλήσεων</h1>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Τύπος Αναφοράς</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                        <option value="daily">Ημερήσια</option>
                        <option value="monthly">Μηνιαία</option>
                        <option value="yearly">Ετήσια</option>
                    </select>
                </div>

                {reportType === 'daily' && (
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

                {reportType === 'monthly' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">Έτος</label>
                            <input
                                type="number"
                                name="year"
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

                {reportType === 'yearly' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Έτος</label>
                        <input
                            type="number"
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            <div className="flex space-x-2 mb-6">
                <Button onClick={generateReport} loading={loading}>
                    Δημιουργία Αναφοράς
                </Button>
                {reportData && (
                    <Button onClick={printReport} variant="secondary">
                        Εκτύπωση
                    </Button>
                )}
            </div>

            {/* Report Display */}
            {loading && <Loading text="Δημιουργία αναφοράς..." />}

            {reportData && (
                <div className="border-t pt-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">
                            Αναφορά Πωλήσεων
                        </h2>
                        <p className="text-gray-600">
                            Περίοδος: {reportData.period.start} - {reportData.period.end}
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <div className="text-sm text-blue-600 mb-1">Σύνολο Αποδείξεων</div>
                            <div className="text-2xl font-bold">{reportData.total_receipts}</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-4">
                            <div className="text-sm text-green-600 mb-1">Ολοκληρωμένες</div>
                            <div className="text-2xl font-bold">{reportData.completed_receipts}</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <div className="text-sm text-red-600 mb-1">Ακυρωμένες</div>
                            <div className="text-2xl font-bold">{reportData.cancelled_receipts}</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded p-4">
                            <div className="text-sm text-purple-600 mb-1">Συνολικό Ποσό</div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(reportData.total_amount)}
                            </div>
                        </div>
                    </div>

                    {/* By Type */}
                    {reportData.by_type && Object.keys(reportData.by_type).length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-3">Ανάλυση ανά Τύπο</h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Τύπος
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Ποσότητα
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Σύνολο
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(reportData.by_type).map(([type, data]) => (
                                        <tr key={type}>
                                            <td className="px-6 py-4 font-medium">
                                                {type === 'fek' ? 'ΦΕΚ' : 'Προϊόντα'}
                                            </td>
                                            <td className="px-6 py-4">{data.count}</td>
                                            <td className="px-6 py-4">{formatCurrency(data.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* FEK by Type */}
                    {reportData.fek_by_type && Object.keys(reportData.fek_by_type).length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-3">ΦΕΚ ανά Τύπο</h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Τύπος ΦΕΚ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Ποσότητα
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Σύνολο
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(reportData.fek_by_type).map(([type, data]) => (
                                        <tr key={type}>
                                            <td className="px-6 py-4 font-medium">ΦΕΚ {type}</td>
                                            <td className="px-6 py-4">{data.count}</td>
                                            <td className="px-6 py-4">{formatCurrency(data.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Receipts List */}
                    {reportData.receipts && reportData.receipts.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-3">Λίστα Αποδείξεων</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Αριθμός
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Ημερομηνία
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Υπάλληλος
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Είδη
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Ποσό
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Κατάσταση
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportData.receipts.map((receipt) => (
                                            <tr key={receipt.receipt_number}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {receipt.receipt_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {receipt.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {receipt.user}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {receipt.items_count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {formatCurrency(receipt.final_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${
                                                            receipt.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {receipt.status === 'completed'
                                                            ? 'Ολοκληρωμένη'
                                                            : 'Ακυρωμένη'}
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
                <div className="text-center text-gray-500 py-8">
                    Επιλέξτε παραμέτρους και πατήστε "Δημιουργία Αναφοράς"
                </div>
            )}
        </div>
    );
}
