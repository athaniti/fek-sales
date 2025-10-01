import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import Loading from '../Components/Common/Loading';
import Button from '../Components/Common/Button';
import ReceiptPrint from '../Components/Common/ReceiptPrint';

export default function Receipts() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        date_from: '',
        date_to: '',
        receipt_number: '',
    });

    useEffect(() => {
        loadReceipts();
    }, []);

    const loadReceipts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/receipts/?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setReceipts(data.success ? data.data.data : []);
            } else {
                console.error('Failed to fetch receipts');
                setReceipts([]);
            }
        } catch (error) {
            console.error('Error loading receipts:', error);
            setReceipts([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReceipt = async (receiptId) => {
        try {
            const response = await fetch(`/api/receipts/${receiptId}`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSelectedReceipt(data.data);
                    setShowPrintModal(true);
                }
            } else {
                alert('Σφάλμα κατά τη φόρτωση της απόδειξης');
            }
        } catch (error) {
            console.error('Error fetching receipt details:', error);
            alert('Σφάλμα κατά τη φόρτωση της απόδειξης');
        }
    };

    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        setSelectedReceipt(null);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadReceipts();
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Αποδείξεις</h1>
                <Link to="/">
                    <Button variant="primary">Νέα Πώληση</Button>
                </Link>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Αριθμός Απόδειξης</label>
                    <input
                        type="text"
                        name="receipt_number"
                        value={filters.receipt_number}
                        onChange={handleFilterChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="REC-2024-000001"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Κατάσταση</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Όλες</option>
                        <option value="completed">Ολοκληρωμένες</option>
                        <option value="cancelled">Ακυρωμένες</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Από Ημερομηνία</label>
                    <input
                        type="date"
                        name="date_from"
                        value={filters.date_from}
                        onChange={handleFilterChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Έως Ημερομηνία</label>
                    <input
                        type="date"
                        name="date_to"
                        value={filters.date_to}
                        onChange={handleFilterChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="md:col-span-4">
                    <Button type="submit" className="w-full md:w-auto">
                        Αναζήτηση
                    </Button>
                </div>
            </form>

            {/* Receipts Table */}
            {loading ? (
                <Loading />
            ) : (
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ενέργειες
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {receipts.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handlePrintReceipt(receipt.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {receipt.receipt_number}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDateTime(receipt.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {receipt.user?.full_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {receipt.items?.length || 0}
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
                                            {receipt.status === 'completed' ? 'Ολοκληρωμένη' : 'Ακυρωμένη'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handlePrintReceipt(receipt.id)}
                                            className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                                        >
                                            👁️ Προβολή
                                        </button>
                                        <button
                                            onClick={() => handlePrintReceipt(receipt.id)}
                                            className="text-green-600 hover:text-green-800 font-medium"
                                        >
                                            🖨️ Εκτύπωση
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {receipts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Δεν βρέθηκαν αποδείξεις
                        </div>
                    )}
                </div>
            )}

            {/* Print Modal */}
            {showPrintModal && selectedReceipt && (
                <ReceiptPrint
                    receipt={selectedReceipt}
                    onClose={handleClosePrintModal}
                />
            )}
        </div>
    );
}
