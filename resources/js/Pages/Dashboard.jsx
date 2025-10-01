import React from 'react';

export default function Dashboard() {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Ταμπλό</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">€</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">Σημερινές Πωλήσεις</p>
                            <p className="text-2xl font-bold text-blue-900">€0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">#</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">Σημερινές Αποδείξεις</p>
                            <p className="text-2xl font-bold text-green-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📄</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-yellow-600">ΦΕΚ Σήμερα</p>
                            <p className="text-2xl font-bold text-yellow-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📦</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-purple-600">Προϊόντα Σήμερα</p>
                            <p className="text-2xl font-bold text-purple-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Γρήγορες Ενέργειες</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-left">
                            🛒 Νέα Πώληση
                        </button>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-left">
                            📄 Αναζήτηση ΦΕΚ
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-left">
                            📊 Αναφορές
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Πρόσφατες Αποδείξεις</h2>
                    <div className="text-center text-gray-500 py-8">
                        Δεν υπάρχουν πρόσφατες αποδείξεις
                    </div>
                </div>
            </div>
        </div>
    );
}
