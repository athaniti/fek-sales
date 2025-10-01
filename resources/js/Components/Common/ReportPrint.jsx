import React from 'react';
import { formatCurrency } from '../../utils/helpers';

export default function ReportPrint({ reportData, reportType, filters, onClose }) {
    if (!reportData) return null;

    const printReport = () => {
        window.print();
    };

    const getTypeLabel = (type) => {
        const typeLabels = {
            'fek': 'ΦΕΚ',
            'book': 'Βιβλία',
            'cd': 'CD',
            'other': 'Άλλα',
            'product': 'Προϊόντα'
        };
        return typeLabels[type] || type;
    };

    const getTypeIcon = (type) => {
        const typeIcons = {
            'fek': '📄',
            'book': '📚',
            'cd': '💿',
            'other': '📦',
            'product': '🏪'
        };
        return typeIcons[type] || '📋';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b print:hidden">
                    <h2 className="text-xl font-bold">Προεπισκόπηση Αναφοράς</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={printReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            🖨️ Εκτύπωση
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                        >
                            ✕ Κλείσιμο
                        </button>
                    </div>
                </div>

                {/* Print Content */}
                <div className="p-6 print:p-0">
                    {/* Header */}
                    <div className="text-center mb-8 print:mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            📄 ΕΘΝΙΚΟ ΤΥΠΟΓΡΑΦΕΙΟ
                        </h1>
                        <h2 className="text-xl font-semibold mb-4">
                            {reportData.period?.title || 'Αναφορά Πωλήσεων'}
                        </h2>
                        <div className="text-gray-600">
                            <p>Περίοδος: {reportData.period?.start} - {reportData.period?.end}</p>
                            <p className="text-sm">Δημιουργήθηκε: {new Date().toLocaleString('el-GR')}</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">📊 Συνοπτικά Στοιχεία</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded">
                                <div className="text-2xl font-bold text-blue-600">
                                    {reportData.totals?.receipts_count || 0}
                                </div>
                                <div className="text-sm text-gray-600">Αποδείξεις</div>
                            </div>
                            <div className="text-center p-4 border rounded">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(reportData.totals?.gross_amount || 0)}
                                </div>
                                <div className="text-sm text-gray-600">Προ Έκπτωσης</div>
                            </div>
                            <div className="text-center p-4 border rounded">
                                <div className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(reportData.totals?.total_amount || 0)}
                                </div>
                                <div className="text-sm text-gray-600">Συνολικό Ποσό</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Sales Summary by Type */}
                    {reportData.items_by_type && reportData.items_by_type.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">📊 Συγκεντρωτική Αναφορά Πωλήσεων</h3>
                            <table className="w-full border-collapse border">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border p-3 text-left font-bold">Είδος</th>
                                        <th className="border p-3 text-center font-bold">Τεμάχια</th>
                                        <th className="border p-3 text-right font-bold">Συνολικό Ποσό Είδους</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.items_by_type.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border p-3">
                                                <span className="mr-2 text-lg">{item.type_icon}</span>
                                                <span className="font-semibold">{item.type_label}</span>
                                            </td>
                                            <td className="border p-3 text-center font-bold">
                                                {item.quantity.toLocaleString()}
                                            </td>
                                            <td className="border p-3 text-right font-bold text-green-600">
                                                {formatCurrency(item.total_amount)}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Total Row */}
                                    <tr className="bg-gray-200 font-bold">
                                        <td className="border p-3">
                                            <span className="mr-2 text-lg">📋</span>
                                            <span>ΣΥΝΟΛΟ</span>
                                        </td>
                                        <td className="border p-3 text-center">
                                            {reportData.items_by_type.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                                        </td>
                                        <td className="border p-3 text-right text-green-700">
                                            {formatCurrency(reportData.totals?.total_amount || 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Receipts List */}
                    {reportData.receipts && reportData.receipts.length > 0 && (
                        <div className="print:break-before-page">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">📋 Λίστα Αποδείξεων</h3>
                            <table className="w-full border-collapse border text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2 text-left">Αριθμός</th>
                                        <th className="border p-2 text-left">Ημερομηνία</th>
                                        <th className="border p-2 text-left">Ώρα</th>
                                        <th className="border p-2 text-left">Υπάλληλος</th>
                                        <th className="border p-2 text-center">Είδη</th>
                                        <th className="border p-2 text-right">Ποσό</th>
                                        <th className="border p-2 text-center">Κατάσταση</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.receipts.map((receipt) => (
                                        <tr key={receipt.receipt_number}>
                                            <td className="border p-2 font-medium">{receipt.receipt_number}</td>
                                            <td className="border p-2">{receipt.date}</td>
                                            <td className="border p-2">{receipt.time}</td>
                                            <td className="border p-2">{receipt.user}</td>
                                            <td className="border p-2 text-center">{receipt.items_count}</td>
                                            <td className="border p-2 text-right font-semibold">
                                                {formatCurrency(receipt.final_amount)}
                                            </td>
                                            <td className="border p-2 text-center">
                                                {receipt.status === 'completed' ? '✅' : '❌'}
                                                {receipt.status_label}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
                        <p>Αναφορά που δημιουργήθηκε από το Σύστημα Πωλήσεων FEK</p>
                        <p>© {new Date().getFullYear()} Εθνικό Τυπογραφείο - Όλα τα δικαιώματα διατηρούνται</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }

                    .print\\:break-before-page {
                        break-before: page;
                    }

                    .print\\:p-0 {
                        padding: 0 !important;
                    }

                    .print\\:mb-6 {
                        margin-bottom: 1.5rem !important;
                    }

                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
