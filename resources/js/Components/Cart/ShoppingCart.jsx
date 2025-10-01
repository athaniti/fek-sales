import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../Common/Button';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

export default function ShoppingCart() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { items, discount, getTotal, getFinalAmount, clearCart, setDiscount } = useCartStore();

    const handleCheckout = async () => {
        if (items.length === 0) {
            alert('Το καλάθι είναι κενό');
            return;
        }

        if (!confirm('Επιβεβαίωση ολοκλήρωσης συναλλαγής;')) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/receipts', {
                items: items,
                discount: discount,
            });

            if (response.data.success) {
                alert('Η απόδειξη δημιουργήθηκε επιτυχώς!');

                // Open print page
                window.open(`/receipts/${response.data.data.id}/print`, '_blank');

                // Clear cart
                clearCart();

                // Navigate to receipt detail
                setTimeout(() => {
                    navigate(`/receipts/${response.data.data.id}`);
                }, 1000);
            }
        } catch (error) {
            alert('Σφάλμα κατά τη δημιουργία απόδειξης');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-gray-500 text-center py-8">
                Το καλάθι είναι κενό
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-3 mb-4">
                {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            {/* Discount */}
            <div className="border-t pt-4 mb-4">
                <label className="block text-sm font-medium mb-2">Έκπτωση (€)</label>
                <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                    <span>Μερικό Σύνολο:</span>
                    <span>{formatCurrency(getTotal())}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between mb-2 text-red-600">
                        <span>Έκπτωση:</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Σύνολο:</span>
                    <span className="font-bold text-xl">{formatCurrency(getFinalAmount())}</span>
                </div>

                <Button
                    onClick={handleCheckout}
                    loading={loading}
                    variant="success"
                    className="w-full"
                    size="lg"
                >
                    Ολοκλήρωση Συναλλαγής
                </Button>
            </div>
        </div>
    );
}
