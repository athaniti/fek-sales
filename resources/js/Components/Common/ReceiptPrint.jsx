import React from 'react';

function ReceiptPrint({ receipt, onClose }) {
    const currentDate = new Date();

    const calculateTotal = () => {
        if (receipt?.items) {
            return receipt.items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
        }
        return 0;
    };

    const handlePrint = () => {
        window.print();
    };

    if (!receipt) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto print-area">
                {/* Print Header - Hidden on screen */}
                <div className="print:block hidden">
                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                        <h1 className="text-2xl font-bold">ΕΘΝΙΚΟ ΤΥΠΟΓΡΑΦΕΙΟ</h1>
                        <p className="text-lg">Σύστημα Πωλήσεων ΦΕΚ</p>
                        <p className="text-sm">Καραολή & Δημητρίου 1, 10437 Αθήνα</p>
                        <p className="text-sm">ΤΗΛ: 210-5279000 | FAX: 210-5279054</p>
                    </div>
                </div>

                {/* Screen Header */}
                <div className="print:hidden p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Προεπισκόπηση Απόδειξης</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="p-6 print:p-4">
                    {/* Receipt Header */}
                    <div className="text-center mb-6 print:mb-4">
                        <h1 className="text-2xl font-bold print:text-3xl">ΑΠΟΔΕΙΞΗ ΠΩΛΗΣΗΣ</h1>
                        <div className="mt-4 text-base print:text-lg">
                            <p>Αρ. Απόδειξης: <span className="font-mono font-bold">#{receipt.id || 'N/A'}</span></p>
                            <p>Ημερομηνία: {new Date(receipt.created_at || Date.now()).toLocaleDateString('el-GR')}</p>
                            <p>Ώρα: {new Date(receipt.created_at || Date.now()).toLocaleTimeString('el-GR')}</p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    {receipt.customer && receipt.customer.name && (
                        <div className="mb-6 print:mb-4 p-4 bg-gray-50 print:bg-white rounded-lg">
                            <h3 className="font-bold mb-3 text-lg">Στοιχεία Πελάτη:</h3>
                            <div className="text-base print:text-lg grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p><strong>Όνομα:</strong> {receipt.customer.name}</p>
                                {receipt.customer.email && <p><strong>Email:</strong> {receipt.customer.email}</p>}
                                {receipt.customer.phone && <p><strong>Τηλέφωνο:</strong> {receipt.customer.phone}</p>}
                                {receipt.customer.address && <p><strong>Διεύθυνση:</strong> {receipt.customer.address}</p>}
                            </div>
                        </div>
                    )}

                    {/* Items Table */}
                    <div className="mb-6 print:mb-4">
                        <h3 className="font-bold mb-4 text-lg">Αγορασμένα Είδη:</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border-2 border-gray-400">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 px-3 py-3 text-left font-bold">Είδος</th>
                                        <th className="border border-gray-400 px-3 py-3 text-left font-bold">Περιγραφή</th>
                                        <th className="border border-gray-400 px-3 py-3 text-center font-bold">Ποσ.</th>
                                        <th className="border border-gray-400 px-3 py-3 text-right font-bold">Τιμή μον.</th>
                                        <th className="border border-gray-400 px-3 py-3 text-right font-bold">Σύνολο</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipt.items && receipt.items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-400 px-3 py-3">
                                                <span className="text-lg">
                                                    {item.type === 'fek' && '📄'}
                                                    {item.type === 'book' && '📚'}
                                                    {item.type === 'cd' && '💿'}
                                                    {item.type === 'other' && '📦'}
                                                    {item.type === 'product' && '🏪'}
                                                </span>
                                                <span className="ml-2 font-medium">
                                                    {item.type === 'fek' && 'ΦΕΚ'}
                                                    {item.type === 'book' && 'Βιβλίο'}
                                                    {item.type === 'cd' && 'CD'}
                                                    {item.type === 'other' && 'Άλλα'}
                                                    {item.type === 'product' && 'Προϊόν'}
                                                </span>
                                            </td>
                                            <td className="border border-gray-400 px-3 py-3">
                                                <div className="font-medium text-base">{item.name}</div>
                                                {item.description && (
                                                    <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                                                )}
                                                {item.metadata && (
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {item.type === 'fek' && item.metadata.issue_number &&
                                                            `Τεύχος: ${item.metadata.issue_number}`}
                                                        {item.type === 'fek' && item.metadata.total_pages &&
                                                            ` | ${item.metadata.total_pages} σελίδες`}
                                                        {item.type === 'book' && item.metadata.author &&
                                                            `Συγγραφέας: ${item.metadata.author}`}
                                                        {item.type === 'book' && item.metadata.publisher &&
                                                            ` | Εκδότης: ${item.metadata.publisher}`}
                                                        {item.type === 'cd' && item.metadata.artist &&
                                                            `Καλλιτέχνης: ${item.metadata.artist}`}
                                                        {item.type === 'cd' && item.metadata.label &&
                                                            ` | Δισκογραφική: ${item.metadata.label}`}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-3 text-center font-medium">
                                                {item.quantity}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-3 text-right font-medium">
                                                €{parseFloat(item.unit_price || 0).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-3 text-right font-bold text-green-600">
                                                €{parseFloat(item.total_price || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100">
                                        <td colSpan="4" className="border-2 border-gray-400 px-3 py-4 text-right font-bold text-lg">
                                            ΓΕΝΙΚΟ ΣΥΝΟΛΟ:
                                        </td>
                                        <td className="border-2 border-gray-400 px-3 py-4 text-right font-bold text-xl text-green-700">
                                            €{calculateTotal().toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Receipt Footer */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-300">
                        <div className="text-center text-gray-600">
                            <p className="text-lg font-medium mb-2">🙏 Ευχαριστούμε για την προτίμησή σας!</p>
                            <p className="mb-4">Για οποιαδήποτε διευκρίνιση επικοινωνήστε μαζί μας</p>
                            <div className="text-sm">
                                <p className="font-medium">🌐 www.et.gr | 📧 info@et.gr</p>
                                <p className="mt-2 text-xs">Αυτή η απόδειξη εκδόθηκε ηλεκτρονικά από το Σύστημα Πωλήσεων του Εθνικού Τυπογραφείου</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screen Actions */}
                <div className="print:hidden p-6 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        🚫 Κλείσιμο
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-lg"
                    >
                        🖨️ Εκτύπωση Απόδειξης
                    </button>
                </div>
            </div>

            {/* Print-specific styles */}
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                    table {
                        page-break-inside: auto;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    thead {
                        display: table-header-group;
                    }
                    tfoot {
                        display: table-footer-group;
                    }
                }
            `}</style>
        </div>
    );
}

export default ReceiptPrint;
