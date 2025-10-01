import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Sale from '../Pages/Sale';
import Receipts from '../Pages/Receipts';
import Reports from '../Pages/Reports';

function App() {
    // Get user data from Laravel
    const user = window.Laravel?.user;

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.Laravel?.csrfToken,
                },
            });

            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo - moved more to the left */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-xl font-bold text-blue-600">
                                        📄 FEK Sales
                                    </h1>
                                </div>

                                {/* Navigation Menu - aligned with logo */}
                                <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                                    <a href="/" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition">
                                        🏠 Αρχική
                                    </a>
                                    <a href="/sale" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition">
                                        🛍️ Νέα Πώληση
                                    </a>
                                    <a href="/receipts" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition">
                                        📋 Αποδείξεις
                                    </a>
                                    <a href="/reports" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition">
                                        📊 Αναφορές
                                    </a>
                                </div>
                            </div>

                            {/* User Info & Logout - better aligned */}
                            <div className="flex items-center space-x-4">
                                {user && (
                                    <>
                                        <span className="hidden sm:inline-block text-sm text-gray-700">
                                            Καλωσήρθες, <span className="font-medium text-blue-600">{user.name}</span>
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                                        >
                                            🚪 Αποσύνδεση
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/sale" element={<Sale />} />
                        <Route path="/receipts" element={<Receipts />} />
                        <Route path="/reports" element={<Reports />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
