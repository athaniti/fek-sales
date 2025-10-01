import React from 'react';
import useCartStore from '../../store/cartStore';
import { formatCurrency } from '../../utils/helpers';

export default function CartItem({ item }) {
    const removeItem = useCartStore((state) => state.removeItem);

    return (
        <div className="border rounded p-3">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="font-medium">{item.description}</div>
                    {item.type === 'fek' && (
                        <div className="text-sm text-gray-600">
                            {item.total_pages} σελίδες
                            {item.color_pages > 0 && ` • ${item.color_pages} έγχρωμες`}
                            {item.maps_count > 0 && ` • ${item.maps_count} χάρτες`}
                        </div>
                    )}
                    {item.price_manually_adjusted && (
                        <div className="text-xs text-yellow-600 mt-1">
                            * Τροποποιημένη τιμή
                        </div>
                    )}
                </div>
                <div className="text-right ml-4">
                    <div className="font-bold">{formatCurrency(item.total_price)}</div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 text-sm hover:text-red-800 transition"
                    >
                        Αφαίρεση
                    </button>
                </div>
            </div>
        </div>
    );
}
