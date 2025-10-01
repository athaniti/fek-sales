import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import Loading from '../Components/Common/Loading';
import Button from '../Components/Common/Button';

export default function ReceiptDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        loadReceipt();
    }, [id]);

    const loadReceipt = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/receipts/${id}`);
            setReceipt(response.data.data);
        } catch (error) {
            console.error('Error loading receipt:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReceipt = async () => {
        if (!cancelReason.trim()) {
            alert('Παρακαλώ εισάγετε λόγο ακύρωσης');
            return;
        }

        if (!confirm('Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την απόδειξη;')) {
            return;
        }

        setCancelling(true);
        try {
            await api.post(`/receipts/${id}/cancel`, { reason: cancelReason });
            alert('Η απόδειξη ακυρώθηκε επιτυχώς');
            setShowCancelModal(false);
            loadReceipt();
        } catch (error) {
            alert('Σφάλμα ακύρωσης απόδειξης');
            console.error(error);
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!receipt) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-center text-gray-500">Η απόδειξη δεν βρέθηκε</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Απόδειξη {receipt.receipt_number}</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => navigate('/receipts')}>
                        Πίσω
                    </Button>
                    <a href={`/receipts/${receipt.id}/print`} target="_blank" rel="noopener noreferrer">
                        <Button variant="success">Εκτύπωση</Button>
                    </a>
                    {receipt.status === 'completed' && (
                        <Button variant="danger" onClick={() => setShowCancelModal(true)}>
                            Ακύρωση
                        </Button>
                    )}
                </div>
            </div>

            {/* Receipt Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-gray-600">Ημερομηνία:</dt>
                            <dd className="font-medium">{formatDateTime(receipt.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">Υπάλληλος:</dt>
                            <dd className="font-medium">{receipt.user?.full_name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">Κατάσταση:</dt>
                            <dd>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        receipt.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {receipt.status === 'completed' ? 'Ολοκληρωμένη' : 'Ακυρωμένη'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                {receipt.status === 'cancelled' && (
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                        <h3 className="font-bold text-red-800 mb-2">Ακυρωμένη Απόδειξη</h3>
                        <p className="text-sm">
                            <strong>Ημερομηνία:</strong> {formatDateTime(receipt.cancelled_at)}
                        </p>
                        <p className="text-sm">
                            <strong>Από:</strong> {receipt.cancelled_by?.full_name}
                        </p>
                        <p className="text-sm mt-2">
                            <strong>Λόγος:</strong> {receipt.cancellation_reason}
                        </p>
                    </div>
                )}
            </div>

            {/* Items Table */}
            <h3 className="font-bold mb-3">Είδη</h3>
            <table className="min-w-full divide-y divide-gray-200 mb-6">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Α/Α
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Περιγραφή
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Ποσότητα
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Τιμή Μονάδας
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Σύνολο
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {receipt.items?.map((item, index) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4">
                                {item.description}
                                {item.item_type === 'fek' && (
                                    <div className="text-sm text-gray-600">
                                        ΦΕΚ {item.fek_type} {item.fek_number} | {item.total_pages} σελίδες
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">{item.quantity}</td>
                            <td className="px-6 py-4">{formatCurrency(item.unit_price)}</td>
                            <td className="px-6 py-4 font-semibold">{formatCurrency(item.total_price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64">
                    <div className="flex justify-between mb-2">
                        <span>Μερικό Σύνολο:</span>
                        <span>{formatCurrency(receipt.total_amount)}</span>
                    </div>
                    {receipt.discount > 0 && (
                        <div className="flex justify-between mb-2 text-red-600">
                            <span>Έκπτωση:</span>
                            <span>-{formatCurrency(receipt.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                        <span>Τελικό Σύνολο:</span>
                        <span>{formatCurrency(receipt.final_amount)}</span>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Ακύρωση Απόδειξης</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Λόγος Ακύρωσης
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows="4"
                                placeholder="Εισάγετε τον λόγο ακύρωσης..."
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={handleCancelReceipt}
                                loading={cancelling}
                                variant="danger"
                                className="flex-1"
                            >
                                Ακύρωση Απόδειξης
                            </Button>
                            <Button
                                onClick={() => setShowCancelModal(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Άκυρο
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
