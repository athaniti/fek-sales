import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FekSearchEnhanced from '../Components/FEK/FekSearchEnhanced';
import ReceiptPrint from '../Components/Common/ReceiptPrint';

function Sale() {
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState('fek'); // fek, books, cd
    const [isLoading, setIsLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [savedReceipt, setSavedReceipt] = useState(null);

    // Product forms state
    const [fekData, setFekData] = useState(null);
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        price: '',
        quantity: 1
    });
    const [cdData, setCdData] = useState({
        title: '',
        artist: '',
        label: '',
        tracks: '',
        price: '',
        quantity: 1
    });
    const [otherData, setOtherData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        quantity: 1
    });

    // Add product to cart
    const addToCart = (product) => {
        const cartItem = {
            id: Date.now(),
            ...product,
            total: parseFloat(product.price) * parseInt(product.quantity)
        };

        setCart([...cart, cartItem]);

        // Reset forms
        if (product.type === 'fek') {
            setFekData(null);
        } else if (product.type === 'book') {
            setBookData({
                title: '',
                author: '',
                publisher: '',
                isbn: '',
                price: '',
                quantity: 1
            });
        } else if (product.type === 'cd') {
            setCdData({
                title: '',
                artist: '',
                label: '',
                tracks: '',
                price: '',
                quantity: 1
            });
        } else if (product.type === 'other') {
            setOtherData({
                title: '',
                description: '',
                category: '',
                price: '',
                quantity: 1
            });
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleFekAddToCart = (fekDetails) => {
        // Προσθήκη κατευθείαν στο καλάθι με την επεξεργασμένη τιμή
        addToCart({
            type: 'fek',
            name: fekDetails.title,
            description: `ΦΕΚ ${fekDetails.issue_number}`,
            price: fekDetails.customPrice || fekDetails.calculatedPrice?.total_price || 10,
            quantity: 1,
            details: fekDetails,
            manualPrice: fekDetails.customPrice ? true : false
        });

        // Καθαρισμός του fekData state μετά την προσθήκη
        setFekData(null);
    };

    const handleFekSelect = (fekDetails) => {
        setFekData(fekDetails);
    };

    const addFekToCart = () => {
        if (fekData) {
            addToCart({
                type: 'fek',
                name: fekData.title,
                description: `ΦΕΚ ${fekData.issue_number}`,
                price: fekData.finalPrice || fekData.calculated_price?.total || 10,
                quantity: 1,
                details: fekData
            });
        }
    };

    const addBookToCart = () => {
        if (bookData.title && bookData.price) {
            addToCart({
                type: 'book',
                name: bookData.title,
                description: `Συγγραφέας: ${bookData.author || 'Άγνωστος'}`,
                price: parseFloat(bookData.price),
                quantity: parseInt(bookData.quantity),
                details: bookData
            });
        }
    };

    const addCdToCart = () => {
        if (cdData.title && cdData.price) {
            addToCart({
                type: 'cd',
                name: cdData.title,
                description: `Καλλιτέχνης: ${cdData.artist || 'Άγνωστος'}`,
                price: parseFloat(cdData.price),
                quantity: parseInt(cdData.quantity),
                details: cdData
            });
        }
    };

    const addOtherToCart = () => {
        if (otherData.title && otherData.price) {
            addToCart({
                type: 'other',
                name: otherData.title,
                description: otherData.description || `Κατηγορία: ${otherData.category || 'Άλλο'}`,
                price: parseFloat(otherData.price),
                quantity: parseInt(otherData.quantity),
                details: otherData
            });
        }
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Προσθέστε τουλάχιστον ένα προϊόν στο καλάθι');
            return;
        }

        if (!customerInfo.name.trim()) {
            alert('Παρακαλώ εισάγετε το όνομα του πελάτη');
            return;
        }

        setIsLoading(true);

        try {
            // Transform cart items to receipt format
            const items = cart.map(item => {
                const baseItem = {
                    type: item.type,
                    description: item.name + (item.description ? ` - ${item.description}` : ''),
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.total,
                    price_manually_adjusted: item.manualPrice || false
                };

                // Add type-specific fields only when relevant
                if (item.type === 'fek') {
                    baseItem.fek_number = item.details?.issue_number || item.details?.number || null;
                    baseItem.fek_type = item.details?.type || 'A';
                    baseItem.fek_date = item.details?.date || new Date().toISOString().split('T')[0];
                    baseItem.fek_title = item.name;
                    baseItem.total_pages = item.details?.total_pages || item.details?.pages || null;
                    baseItem.color_pages = item.details?.color_pages || 0;
                    baseItem.maps_count = item.details?.maps_count || 0;
                } else if (item.type === 'product') {
                    baseItem.product_id = item.id || null;
                }

                return baseItem;
            });

            const response = await fetch('/api/receipts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.Laravel?.csrfToken,
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    items: items,
                    customer: customerInfo,
                    discount: 0
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);

                // Try to parse as JSON, fallback to text
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { message: `HTTP ${response.status}: ${errorText}` };
                }

                throw new Error(errorData.message || 'Σφάλμα κατά την καταχώρηση');
            }

            const data = await response.json();

            if (data.success) {
                setSavedReceipt(data.data);
                setShowReceipt(true);
            } else {
                throw new Error(data.message || 'Σφάλμα κατά την καταχώρηση');
            }
        } catch (error) {
            console.error('Sale error:', error);
            alert('Σφάλμα κατά την καταχώρηση της πώλησης: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        // Ask if user wants to start a new sale or go back to receipts
        const choice = confirm('Θέλετε να δημιουργήσετε νέα πώληση ή να πάτε στη λίστα αποδείξεων?\n\nΠατήστε OK για νέα πώληση ή Cancel για λίστα αποδείξεων.');

        if (choice) {
            // Reset for new sale
            setCart([]);
            setCustomerInfo({
                name: '',
                email: '',
                phone: '',
                address: ''
            });
            setSavedReceipt(null);
        } else {
            // Go to receipts list
            navigate('/receipts');
        }
    };

    const tabs = [
        { id: 'fek', label: '📄 ΦΕΚ', icon: '📄' },
        { id: 'books', label: '📚 Βιβλία', icon: '📚' },
        { id: 'cd', label: '💿 CD', icon: '💿' },
        { id: 'other', label: '📦 Άλλα', icon: '📦' }
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Customer Information Section - Top */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Νέα Πώληση</h1>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">📋 Στοιχεία Πελάτη</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Όνομα Πελάτη *
                            </label>
                            <input
                                type="text"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={customerInfo.email}
                                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Τηλέφωνο
                            </label>
                            <input
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Διεύθυνση
                            </label>
                            <input
                                type="text"
                                value={customerInfo.address}
                                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Selection Section - Bottom */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Selection Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h2 className="text-lg font-semibold text-green-700">🛒 Επιλογή Προϊόντων</h2>
                            </div>

                            {/* Product Tabs */}
                            <div className="px-6 pt-4">
                                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition ${
                                                activeTab === tab.id
                                                    ? 'bg-white text-blue-700 shadow'
                                                    : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                        >
                                            <span className="mr-2">{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Content */}
                            <div className="p-6">
                                {activeTab === 'fek' && (
                                    <div className="space-y-4">
                                        <FekSearchEnhanced
                                            onSelectFek={handleFekSelect}
                                            onAddToCart={handleFekAddToCart}
                                        />

                                        {fekData && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-blue-800 mb-2">Επιλεγμένο ΦΕΚ:</h4>
                                                <p className="text-sm text-gray-700">{fekData.title}</p>
                                                <p className="text-sm font-medium text-green-600">
                                                    Τιμή: €{(fekData.finalPrice || fekData.calculated_price?.total || 10).toFixed(2)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={addFekToCart}
                                                    className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                                                >
                                                    Προσθήκη στο Καλάθι
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'books' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Τίτλος Βιβλίου *
                                            </label>
                                            <input
                                                type="text"
                                                value={bookData.title}
                                                onChange={(e) => setBookData({...bookData, title: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Συγγραφέας
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookData.author}
                                                    onChange={(e) => setBookData({...bookData, author: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Εκδότης
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookData.publisher}
                                                    onChange={(e) => setBookData({...bookData, publisher: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ISBN
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookData.isbn}
                                                    onChange={(e) => setBookData({...bookData, isbn: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Τιμή (€) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={bookData.price}
                                                    onChange={(e) => setBookData({...bookData, price: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ποσότητα
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={bookData.quantity}
                                                    onChange={(e) => setBookData({...bookData, quantity: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addBookToCart}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                                        >
                                            Προσθήκη Βιβλίου στο Καλάθι
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'cd' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Τίτλος CD *
                                            </label>
                                            <input
                                                type="text"
                                                value={cdData.title}
                                                onChange={(e) => setCdData({...cdData, title: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Καλλιτέχνης/Συγκρότημα
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cdData.artist}
                                                    onChange={(e) => setCdData({...cdData, artist: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Δισκογραφική
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cdData.label}
                                                    onChange={(e) => setCdData({...cdData, label: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Αριθμός Κομματιών
                                                </label>
                                                <input
                                                    type="number"
                                                    value={cdData.tracks}
                                                    onChange={(e) => setCdData({...cdData, tracks: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Τιμή (€) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={cdData.price}
                                                    onChange={(e) => setCdData({...cdData, price: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ποσότητα
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={cdData.quantity}
                                                    onChange={(e) => setCdData({...cdData, quantity: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addCdToCart}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                                        >
                                            Προσθήκη CD στο Καλάθι
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'other' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Τίτλος Προϊόντος *
                                            </label>
                                            <input
                                                type="text"
                                                value={otherData.title}
                                                onChange={(e) => setOtherData({...otherData, title: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="π.χ. Χάρτης Αττικής, Αφίσα, DVD κ.λ.π."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Περιγραφή
                                            </label>
                                            <textarea
                                                value={otherData.description}
                                                onChange={(e) => setOtherData({...otherData, description: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                rows="2"
                                                placeholder="Σύντομη περιγραφή του προϊόντος..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Κατηγορία
                                                </label>
                                                <select
                                                    value={otherData.category}
                                                    onChange={(e) => setOtherData({...otherData, category: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Επιλέξτε...</option>
                                                    <option value="Χάρτες">Χάρτες</option>
                                                    <option value="Αφίσες">Αφίσες</option>
                                                    <option value="DVD">DVD</option>
                                                    <option value="Περιοδικά">Περιοδικά</option>
                                                    <option value="Άλλο">Άλλο</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Τιμή (€) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={otherData.price}
                                                    onChange={(e) => setOtherData({...otherData, price: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ποσότητα
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={otherData.quantity}
                                                    onChange={(e) => setOtherData({...otherData, quantity: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addOtherToCart}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                                        >
                                            Προσθήκη Προϊόντος στο Καλάθι
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg sticky top-6">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="text-lg font-semibold text-purple-700">🛍️ Καλάθι Αγορών</h3>
                            </div>

                            <div className="p-6">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Το καλάθι είναι άδειο</p>
                                ) : (
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded border">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">{item.name}</h4>
                                                        <p className="text-xs text-gray-600">{item.description}</p>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {item.quantity}x €{item.price.toFixed(2)} = €{item.total.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="border-t pt-3 mt-4">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>Σύνολο:</span>
                                                <span className="text-green-600">€{calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={cart.length === 0 || isLoading}
                                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition"
                                >
                                    {isLoading ? 'Επεξεργασία...' : 'Ολοκλήρωση Πώλησης'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Receipt Modal */}
            {showReceipt && savedReceipt && (
                <ReceiptPrint
                    receipt={savedReceipt}
                    onClose={handleReceiptClose}
                />
            )}
        </div>
    );
}

export default Sale;
