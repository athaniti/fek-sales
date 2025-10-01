import React, { useState } from 'react';
import Button from '../Components/Common/Button';

export default function TestExports() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const testPdfExport = async () => {
        setLoading(true);
        setMessage('Δοκιμή PDF Export...');

        try {
            const params = new URLSearchParams({
                type: 'daily',
                date: '2024-01-15'
            });

            const response = await fetch(`/api/reports/export/pdf?${params}`);

            if (response.ok) {
                // Create blob and download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'test-report.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setMessage('✅ PDF Export επιτυχής!');
            } else {
                const errorText = await response.text();
                setMessage(`❌ PDF Export failed: ${errorText}`);
            }
        } catch (error) {
            setMessage(`❌ PDF Export error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testExcelExport = async () => {
        setLoading(true);
        setMessage('Δοκιμή Excel Export...');

        try {
            const params = new URLSearchParams({
                type: 'daily',
                date: '2024-01-15'
            });

            const response = await fetch(`/api/reports/export/excel?${params}`);

            if (response.ok) {
                // Create blob and download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'test-report.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setMessage('✅ Excel Export επιτυχής!');
            } else {
                const errorText = await response.text();
                setMessage(`❌ Excel Export failed: ${errorText}`);
            }
        } catch (error) {
            setMessage(`❌ Excel Export error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testPdfPreview = () => {
        const params = new URLSearchParams({
            type: 'daily',
            date: '2024-01-15'
        });

        window.open(`/api/reports/export/pdf/preview?${params}`, '_blank');
        setMessage('📄 PDF Preview ανοίχτηκε σε νέο tab');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">🧪 Test Export Functionality</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        onClick={testPdfExport}
                        disabled={loading}
                        className="w-full"
                    >
                        📄 Test PDF Download
                    </Button>

                    <Button
                        onClick={testExcelExport}
                        disabled={loading}
                        className="w-full"
                    >
                        📊 Test Excel Download
                    </Button>

                    <Button
                        onClick={testPdfPreview}
                        disabled={loading}
                        variant="secondary"
                        className="w-full"
                    >
                        👁️ Test PDF Preview
                    </Button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${
                        message.includes('✅')
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : message.includes('❌')
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                        {message}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Επεξεργασία...</span>
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Test Parameters:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Type: daily</li>
                    <li>• Date: 2024-01-15</li>
                    <li>• Export formats: PDF & Excel</li>
                </ul>
            </div>
        </div>
    );
}
