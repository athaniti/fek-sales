import React, { useState } from 'react';

function FekSearch({ onSelectFek }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFek, setSelectedFek] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [customPrice, setCustomPrice] = useState('');
    const [isEditingPrice, setIsEditingPrice] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            // Empty search - show all results
            setShowResults(true);
        }

        setIsLoading(true);
        setShowResults(true);
        setShowDetails(false); // Hide details when searching
        setSelectedFek(null);

        try {
            const response = await fetch(`/api/fek/search?q=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.Laravel?.csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data || []);
            } else {
                console.error('Search failed:', data.message);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectFromList = async (fek) => {
        setIsLoading(true);

        try {
            // Get detailed information and pricing data
            const response = await fetch(`/api/fek/details?id=${fek.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.Laravel?.csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                const fekDetails = {
                    ...fek,
                    ...data.data,
                    // Calculated price based on pages, images, colors, maps
                    calculatedPrice: data.data.calculated_price || calculateFekPrice(data.data)
                };

                setSelectedFek(fekDetails);
                setCustomPrice(fekDetails.calculatedPrice?.total_price?.toFixed(2) || '0.00');
                setShowDetails(true); // Show details view
                setShowResults(false); // Hide search results
            }
        } catch (error) {
            console.error('Details fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateFekPrice = (fekData) => {
        // Base price calculation logic
        let basePrice = 0.15; // Base price per page
        let totalPrice = (fekData.pages || 1) * basePrice;

        // Additional costs
        if (fekData.has_maps) {
            totalPrice += (fekData.maps_count || 1) * 2.00; // €2 per map
        }

        if (fekData.has_images) {
            totalPrice += (fekData.images_count || 1) * 0.50; // €0.50 per image
        }

        if (fekData.is_colored) {
            totalPrice *= 1.5; // 50% surcharge for color
        }

        // Minimum price
        return Math.max(totalPrice, 1.00);
    };

    const clearSelection = () => {
        setSelectedFek(null);
        setShowDetails(false);
        setShowResults(true);
        setCustomPrice('');
        setIsEditingPrice(false);
    };

    const handlePriceEdit = () => {
        setIsEditingPrice(true);
    };

    const handlePriceSave = () => {
        const newPrice = parseFloat(customPrice);
        if (isNaN(newPrice) || newPrice < 0) {
            alert('Παρακαλώ εισάγετε μια έγκυρη τιμή');
            return;
        }

        const updatedFek = {
            ...selectedFek,
            customPrice: newPrice,
            calculatedPrice: {
                ...selectedFek.calculatedPrice,
                total_price: newPrice,
                is_custom: true
            }
        };

        setSelectedFek(updatedFek);
        setIsEditingPrice(false);
    };

    const handleConfirmSelection = () => {
        if (selectedFek) {
            onSelectFek && onSelectFek(selectedFek);
        }
    };

    const handleBackToSearch = () => {
        setShowDetails(false);
        setShowResults(true);
        setSelectedFek(null);
    };    const newSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
        setSelectedFek(null);
        onSelectFek && onSelectFek(null);
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            {!selectedFek && (
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Αναζήτηση ΦΕΚ (π.χ. Νόμος 4947/2022)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition"
                    >
                        {isLoading ? 'Αναζήτηση...' : 'Αναζήτηση'}
                    </button>
                </div>
            )}

            {/* Search Results List */}
            {showResults && searchResults.length > 0 && !selectedFek && (
                <div className="border border-gray-200 rounded-md">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">
                                Αποτελέσματα αναζήτησης ({searchResults.length})
                            </h3>
                            <button
                                onClick={newSearch}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Νέα αναζήτηση
                            </button>
                        </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((fek, index) => (
                            <div
                                key={fek.id || index}
                                onClick={() => handleSelectFromList(fek)}
                                className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-medium text-blue-900">{fek.title}</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <div className="flex items-center space-x-4">
                                                <span>📄 {fek.issue}</span>
                                                <span>📅 {fek.date}</span>
                                                <span>📖 {fek.pages} σελίδες</span>
                                            </div>
                                        </div>
                                        {fek.summary && (
                                            <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                {fek.summary}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 text-right">
                                        <div className="text-sm font-medium text-green-600">
                                            ~€{calculateFekPrice(fek).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            εκτιμώμενη τιμή
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {showResults && searchResults.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📄</div>
                    <div>Δεν βρέθηκαν αποτελέσματα</div>
                    <button
                        onClick={newSearch}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Δοκιμάστε διαφορετική αναζήτηση
                    </button>
                </div>
            )}

            {/* Selected FEK */}
            {selectedFek && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-green-900">{selectedFek.title}</h3>
                                    <div className="text-sm text-green-700 mt-1">
                                        <div className="flex items-center space-x-4">
                                            <span>📄 {selectedFek.issue}</span>
                                            <span>📅 {selectedFek.date}</span>
                                            <span>📖 {selectedFek.pages} σελίδες</span>
                                        </div>
                                    </div>

                                    {/* Pricing Details */}
                                    <div className="mt-3 p-3 bg-white rounded border">
                                        <div className="text-sm font-medium text-gray-700 mb-2">Λεπτομέρειες τιμολόγησης:</div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div>• Βασική τιμή: {selectedFek.pages} σελίδες × €0.15 = €{(selectedFek.pages * 0.15).toFixed(2)}</div>
                                            {selectedFek.has_maps && (
                                                <div>• Χάρτες: {selectedFek.maps_count || 1} × €2.00 = €{((selectedFek.maps_count || 1) * 2.00).toFixed(2)}</div>
                                            )}
                                            {selectedFek.has_images && (
                                                <div>• Εικόνες: {selectedFek.images_count || 1} × €0.50 = €{((selectedFek.images_count || 1) * 0.50).toFixed(2)}</div>
                                            )}
                                            {selectedFek.is_colored && (
                                                <div>• Έγχρωμη εκτύπωση: +50%</div>
                                            )}
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="text-sm font-bold text-green-800">
                                                Τελική τιμή: €{selectedFek.calculatedPrice.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={clearSelection}
                                    className="text-green-600 hover:text-green-800 ml-4"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-3">
                        {selectedFek.pdf_url && (
                            <button
                                onClick={() => window.open(selectedFek.pdf_url, '_blank')}
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                            >
                                📄 Προεπισκόπηση PDF
                            </button>
                        )}
                        <button
                            onClick={newSearch}
                            className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
                        >
                            Επιλογή άλλου ΦΕΚ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FekSearch;
