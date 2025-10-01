import React, { useState, useEffect } from 'react';
import { useFekApi } from '../../hooks/useFekApi';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import { formatCurrency } from '../../utils/helpers';

export default function FekModal({ fek, onClose, onAddToCart }) {
    const [fekDetails, setFekDetails] = useState(null);
    const [price, setPrice] = useState(0);
    const { getFekDetails, loading } = useFekApi();

    useEffect(() => {
        loadFekDetails();
    }, [fek]);

    const loadFekDetails = async () => {
        try {
            const data = await getFekDetails(fek.fek_number, fek.fek_type, fek.fek_date);
            setFekDetails(data);
            setPrice(data.calculated_price?.price || 0);
        } catch (error) {
            console.error('Error loading FEK details:', error);
        }
    };

    const handleAddToCart = () => {
        if (fekDetails) {
            onAddToCart({
                ...fekDetails,
                price: parseFloat(price),
                price_manually_adjusted: price != fekDetails.calculated_price?.price,
            });
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Προβολή ΦΕΚ" size="xl">
            {loading && <Loading />}

            {!loading && fekDetails && (
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Details */}
                    <div>
                        <h4 className="font-bold mb-3">Στοιχεία ΦΕΚ</h4>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-sm text-gray-600">Τύπος:</dt>
                                <dd className="font-medium">{fekDetails.fek_type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Αριθμός:</dt>
                                <dd className="font-medium">{fekDetails.fek_number}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Ημερομηνία:</dt>
                                <dd className="font-medium">{fekDetails.fek_date}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Τίτλος:</dt>
                                <dd className="font-medium">{fekDetails.title}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Σελίδες:</dt>
                                <dd className="font-medium">{fekDetails.total_pages}</dd>
                            </div>
                            {fekDetails.color_pages > 0 && (
                                <div>
                                    <dt className="text-sm text-gray-600">Έγχρωμες Σελίδες:</dt>
                                    <dd className="font-medium">{fekDetails.color_pages}</dd>
                                </div>
                            )}
                            {fekDetails.maps_count > 0 && (
                                <div>
                                    <dt className="text-sm text-gray-600">Χάρτες:</dt>
                                    <dd className="font-medium">{fekDetails.maps_count}</dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Τιμή (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Προτεινόμενη τιμή: {formatCurrency(fekDetails.calculated_price?.price || 0)}
                            </p>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            className="w-full mt-4"
                            variant="success"
                        >
                            Προσθήκη στο Καλάθι
                        </Button>
                    </div>

                    {/* Right Column - PDF Preview */}
                    <div>
                        <h4 className="font-bold mb-3">Προεπισκόπηση PDF</h4>
                        <div className="border rounded h-96 bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-500">PDF Viewer (θα υλοποιηθεί)</p>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
