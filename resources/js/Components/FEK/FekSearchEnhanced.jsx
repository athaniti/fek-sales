import React, { useState } from 'react';

function FekSearchEnhanced({ onSelectFek, onAddToCart }) {
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
        let totalPrice = (fekData.total_pages || 1) * basePrice;

        // Additional costs
        if (fekData.maps_count > 0) {
            totalPrice += (fekData.maps_count || 1) * 2.00; // €2 per map
        }

        if (fekData.has_images) {
            totalPrice += (fekData.color_pages || 1) * 0.50; // €0.50 per color page
        }

        if (fekData.color_pages > 0) {
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
            // Προσθήκη της τιμής στο ΦΕΚ object
            const fekWithPrice = {
                ...selectedFek,
                customPrice: parseFloat(customPrice) || selectedFek.calculatedPrice?.total_price || 10
            };

            // Κλήση της onAddToCart αν υπάρχει, αλλιώς fallback στο onSelectFek
            if (onAddToCart) {
                onAddToCart(fekWithPrice);
                // Καθαρισμός του state μετά την προσθήκη
                clearSelection();
            } else if (onSelectFek) {
                onSelectFek(fekWithPrice);
            }
        }
    };

    const handleBackToSearch = () => {
        setShowDetails(false);
        setShowResults(true);
        setSelectedFek(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Αναζήτηση ΦΕΚ</h3>

            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Αναζήτηση ΦΕΚ (αριθμός, τίτλος, κλπ)..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Αναζήτηση...' : 'Αναζήτηση'}
                </button>
            </div>

            {/* Search Results List */}
            {showResults && !showDetails && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                        Αποτελέσματα ({searchResults.length})
                    </h4>

                    {searchResults.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-center py-8">
                            Δεν βρέθηκαν αποτελέσματα
                        </p>
                    )}

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {searchResults.map((fek) => (
                            <div
                                key={fek.id}
                                onClick={() => handleSelectFromList(fek)}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">
                                            ΦΕΚ {fek.issue_number}
                                        </h5>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {fek.title}
                                        </p>
                                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                            <span>📄 {fek.total_pages} σελίδες</span>
                                            {fek.color_pages > 0 && (
                                                <span>🎨 {fek.color_pages} έγχρωμες</span>
                                            )}
                                            {fek.maps_count > 0 && (
                                                <span>🗺️ {fek.maps_count} χάρτες</span>
                                            )}
                                            {fek.has_images && <span>🖼️ Εικόνες</span>}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-blue-600">
                                        Κλικ για λεπτομέρειες →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Details View */}
            {showDetails && selectedFek && (
                <div className="space-y-6">
                    {/* Header with Back Button */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBackToSearch}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                            ← Επιστροφή στην αναζήτηση
                        </button>
                        <h4 className="font-medium text-gray-900">
                            ΦΕΚ {selectedFek.issue_number}
                        </h4>
                    </div>

                    {/* FEK Details in Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Details & Pricing */}
                        <div className="space-y-4">
                            {/* Basic Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-medium mb-3">Στοιχεία ΦΕΚ</h5>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Τίτλος:</strong> {selectedFek.title}</div>
                                    <div><strong>Αριθμός:</strong> {selectedFek.issue_number}</div>
                                    <div><strong>Ημερομηνία:</strong> {selectedFek.publication_date}</div>
                                    <div><strong>Σελίδες:</strong> {selectedFek.total_pages}</div>
                                    {selectedFek.color_pages > 0 && (
                                        <div><strong>Έγχρωμες σελίδες:</strong> {selectedFek.color_pages}</div>
                                    )}
                                    {selectedFek.maps_count > 0 && (
                                        <div><strong>Χάρτες:</strong> {selectedFek.maps_count}</div>
                                    )}
                                    <div><strong>Εικόνες:</strong> {selectedFek.has_images ? 'Ναι' : 'Όχι'}</div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h5 className="font-medium mb-3">Τιμολόγηση</h5>

                                {selectedFek.calculatedPrice && (
                                    <div className="space-y-2 text-sm">
                                        <div>Βασική τιμή: €{selectedFek.calculatedPrice.base_price?.toFixed(2) || '0.00'}</div>
                                        {selectedFek.calculatedPrice.color_surcharge > 0 && (
                                            <div>Επιπλέον έγχρωμα: €{selectedFek.calculatedPrice.color_surcharge?.toFixed(2)}</div>
                                        )}
                                        {selectedFek.calculatedPrice.maps_cost > 0 && (
                                            <div>Κόστος χαρτών: €{selectedFek.calculatedPrice.maps_cost?.toFixed(2)}</div>
                                        )}
                                        {selectedFek.calculatedPrice.images_cost > 0 && (
                                            <div>Κόστος εικόνων: €{selectedFek.calculatedPrice.images_cost?.toFixed(2)}</div>
                                        )}
                                        <hr className="my-2" />
                                    </div>
                                )}

                                {/* Editable Price */}
                                <div className="flex items-center gap-3">
                                    <strong>Τελική τιμή:</strong>
                                    {isEditingPrice ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={customPrice}
                                                onChange={(e) => setCustomPrice(e.target.value)}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                                            />
                                            <span>€</span>
                                            <button
                                                onClick={handlePriceSave}
                                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={() => setIsEditingPrice(false)}
                                                className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-blue-600">
                                                €{customPrice}
                                            </span>
                                            <button
                                                onClick={handlePriceEdit}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Επεξεργασία
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {selectedFek.calculatedPrice?.is_custom && (
                                    <p className="text-xs text-orange-600 mt-1">
                                        * Τιμή επεξεργασμένη από υπάλληλο
                                    </p>
                                )}
                            </div>

                            {/* Metadata */}
                            {selectedFek.metadata && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium mb-3">Μεταδεδομένα</h5>
                                    <div className="space-y-2 text-sm">
                                        {selectedFek.metadata.ministry && (
                                            <div><strong>Υπουργείο:</strong> {selectedFek.metadata.ministry}</div>
                                        )}
                                        {selectedFek.metadata.category && (
                                            <div><strong>Κατηγορία:</strong> {selectedFek.metadata.category}</div>
                                        )}
                                        {selectedFek.metadata.summary && (
                                            <div><strong>Περίληψη:</strong> {selectedFek.metadata.summary}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirmSelection}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Προσθήκη στο Καλάθι
                                </button>
                                <button
                                    onClick={clearSelection}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Ακύρωση
                                </button>
                            </div>
                        </div>

                        {/* Right Column - PDF Preview */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-medium mb-3">Προεπισκόπηση PDF</h5>

                                {selectedFek.pdf_url ? (
                                    <div className="space-y-3">
                                        {/* PDF Embed or Link */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <div className="text-6xl text-red-500 mb-2">📄</div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                ΦΕΚ {selectedFek.issue_number}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-3">
                                                {selectedFek.total_pages} σελίδες
                                            </p>
                                            <a
                                                href={selectedFek.pdf_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                Άνοιγμα PDF
                                            </a>
                                        </div>

                                        {/* PDF Info */}
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div>📏 Μέγεθος: {selectedFek.total_pages} σελίδες</div>
                                            {selectedFek.color_pages > 0 && (
                                                <div>🎨 Έγχρωμες: {selectedFek.color_pages}</div>
                                            )}
                                            {selectedFek.has_images && (
                                                <div>🖼️ Περιέχει εικόνες</div>
                                            )}
                                            {selectedFek.maps_count > 0 && (
                                                <div>🗺️ Χάρτες: {selectedFek.maps_count}</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">📄</div>
                                        <p>Δεν υπάρχει διαθέσιμο PDF</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FekSearchEnhanced;
